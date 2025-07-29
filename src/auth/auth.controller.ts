/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signin.dto';
import { RoleGuard } from './guards/role.guards';
import { RefreshDtoToken } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signIn(@Body() body: SignInDto, @Req() req) {
    return this.authService.signIn(body, req);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('admin', 'user')
  @Get('profile')
  getProfile(@Req() req) {
    return {
      message: 'Bạn đang đăng nhập',
      user: req.user,
    };
  }

  @Post('refresh')
  refresh(@Body() body: RefreshDtoToken, @Req() req) {
    return this.authService.refreshToken(body, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req, @Body() body: LogoutDto) {
    return this.authService.logout(req.user.userId, body.deviceId);
  }
}
