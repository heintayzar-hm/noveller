import { Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Req, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/locale-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { LoginAuthGuard } from './guards/login-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginAuthGuard)
  @Post('login')
  async login(@Req() req:any, @Res({ passthrough: true }) res:any) {
    const responseObj = await this.authService.login(req.body);
    const { access_token, ...rest } = responseObj;

    res.cookie('x-access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return rest;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req:any) {
    const token = await this.authService.getToken(req)
    return this.authService.getProfile(token);
  }

    @Post('register')
    async register(@Body() newUserData: RegisterDto) {
        return this.authService.register(newUserData);
    }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-email-verification')
  async resendEmail(@Body() dto: ResendEmailDto) {
    return this.authService.resendEmail(dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ResendEmailDto) {
    return this.authService.forgotPassword(dto);
  }

}
