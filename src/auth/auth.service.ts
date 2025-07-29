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
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signUp.dto';
import { RefreshDtoToken } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userSessionService: UserSessionService,
  ) {}
  async signUp(dto: SignUpDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }
    const hashPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      ...dto,
      password: hashPassword,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
  async signIn(dto: SignInDto, req: Request) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '30s',
        secret: accessTokenSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: refreshTokenSecret,
      }), // Thời gian hết hạn của refresh token
    ]);
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
    const session = await this.userSessionService.findByUserAndDevice(
      dto.deviceId,
    );

    if (!session) {
      throw new ForbiddenException('session không tồn tại');
    }

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

    const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret: refreshTokenSecret,
    });
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new ForbiddenException('Người dùng không tồn tại');
    }
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
