/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  accessTokenSecret,
  refreshTokenSecret,
} from 'src/common/constants/config';
import { UserSessionService } from 'src/user-session/user-session.service';
import { UserService } from 'src/user/user.service';
import { RefreshDtoToken } from './dto/refresh-token.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async signUp(dto: SignUpDto) {
    // kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }
    // nếu chưa tồn tại thì băm mật khẩu và tạo người dùng mới
    const hashPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashPassword,
    });
    const { password, ...result } = user;
    return result;
  }

  async signIn(dto: SignInDto, req: Request) {
    // kiểm tra xem email có tồn tại không
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }
    // nếu tồn tại thì so sánh mật khẩu
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }
    // nếu mật khẩu chính xác thì tạo access token và refresh token
    const payload = { id: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '30s',
        secret: accessTokenSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: refreshTokenSecret,
      }),
    ]);
    // luư refresh token đã được mã hoá vào cơ sở dữ liệu
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userSessionService.create({
      userId: user.id,
      deviceId: dto.deviceId,
      refreshToken: hashedToken,
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: (req as any).ip || (req as any).socket?.remoteAddress,
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(dto: RefreshDtoToken, req: Request) {
    // kiểm tra xem có deviceId nào đang login phù hợp không?
    const session = await this.userSessionService.findByUserAndDevice(
      dto.deviceId,
    );
    if (!session) {
      throw new ForbiddenException('session không tồn tại');
    }

    // nếu có thì so sánh refresh token có đúng không (vì lúc lưu  đã hash nên giờ phải compare)
    const isMatch = await bcrypt.compare(
      dto.refreshToken,
      session.refreshToken,
    );
    if (!isMatch) {
      await this.userSessionService.deleteByDevice(
        session.userId,
        dto.deviceId,
      );
      throw new ForbiddenException('RefreshToken không hợp lệ');
    }
    // nếu đúng thì giải mã refresh token để lấy thông tin người dùng
    const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret: refreshTokenSecret,
    });
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new ForbiddenException('Người dùng không tồn tại');
    }
    // nếu người dùng tồn tại thì tạo access token mới
    const accessToken = await this.jwtService.signAsync(
      { id: payload.id, email: payload.email, role: payload.role },
      {
        secret: accessTokenSecret,
        expiresIn: '30s', // Thời gian hết hạn của access token
      },
    );
    return { accessToken };
  }
  async logout(userId: number, deviceId: string) {
    const deleted = await this.userSessionService.deleteByDevice(
      userId,
      deviceId,
    );
    if (!deleted) {
      throw new NotFoundException('Phiên đăng nhập không tồn tại');
    }
    return { message: 'Đăng xuất thành công', deviceId };
  }
}
