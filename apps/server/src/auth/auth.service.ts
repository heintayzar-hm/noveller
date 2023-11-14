import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@server/lib/Hashing';
import { User } from '@server/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(pass: string, email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // need to encrypt password with bcrypt
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const dbUser = await this.usersService.findByEmail(user.email) as User;
    const isPasswordCorrect = await HashService.comparePasswords(user.password, dbUser.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        success: false,
        status: 401,
        message: "Username or password is incorrect!!",
      });
    }
    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload)
    // hash access_token
    const hashedAccessToken = await HashService.encrypt(access_token);

    return {
      access_token: hashedAccessToken,
      user: new User(dbUser),
      success: true,
    };
  }

  async register(user: any) {
    const hashedPasswordUserDto = await this.hashingPasswordFromUserDto(user);
    const isExistingUser = await this.usersService?.findByEmail(hashedPasswordUserDto.email);
    const code = this.usersService.generateRandomNumber();

    // add code to hashPasswordFromUserDto
    const hashedPasswordUserDtoWithCode = {
      ...hashedPasswordUserDto,
      code,
    }
    try {
      await this.usersService.sendVerificationEmail(hashedPasswordUserDtoWithCode);
    } catch (error) {
      throw error;
    }
    if (isExistingUser) {
      return this.usersService.update(isExistingUser.id, hashedPasswordUserDtoWithCode);
    }
    return this.usersService.create(hashedPasswordUserDtoWithCode);
  }

  async verifyEmail(dto: { email: string, code: number}) {
    const user = await this.usersService.findByEmail(dto.email) as User;
    try {
      const response = await this.usersService.verifiedEmail(user.id, dto.code);
      if (response.success) {
        return {
          ...response,
          access_token: this.jwtService.signAsync({ email: user.email, sub: user.id }),
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getProfile(token: string) {
    const user = await this.getUserFromToken(token) as User;
    return {
      success: true,
      status: 200,
      user: new User(user),
    }
  }


  async resendEmail(dto: { email: string }) {
    const user = await this.usersService.findByEmail(dto.email) as User;
    const code = this.usersService.generateRandomNumber();
    const dtoWithCode = {
      ...user,
      code,
    }
    try {
      await this.usersService.sendVerificationEmail(dtoWithCode);
    } catch (error) {
      throw error;
    }

    return this.usersService.update(user.id, dtoWithCode);
  }

  async forgotPassword(dto: { email: string }) {
    const user = await this.usersService.findByEmail(dto.email) as User;
    const code = this.usersService.generateRandomNumber();
    const dtoWithCode = {
      ...user,
      code,
    }

    try {
      await this.usersService.sendVerificationEmail(dtoWithCode);
    } catch (error) {
      throw error;
    }

    return this.usersService.update(user.id, dtoWithCode);
  }

  async updatePassword(dto: { email: string, code: number, password: string }) {
    const user = await this.usersService.findByEmail(dto.email) as User;
    if (user.code !== dto.code) {
      throw new UnauthorizedException({
        success: false,
        status: 401,
        message: "Code is incorrect",
      });
    }

    const hashedPassword = await HashService.hashPassword(dto.password);
    const dtoWithPassword = {
      ...user,
      password: hashedPassword,
      code: null,
    }

    return this.usersService.update(user.id, dtoWithPassword);
  }

  // helpers
  async getToken(@Req() req: any) {
    const token = req.cookies['x-access_token'] || req.headers['authorization']?.replace('Bearer ', '');
    const decryptedToken = HashService.decrypt(token);
    return decryptedToken;
  }

  async getUserFromToken(token: string) {
    const { email } = this.jwtService.decode(token) as { email: string };
    return this.usersService.findByEmail(email);
  }

  async hashingPasswordFromUserDto(createUserDto:User): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await HashService.hashPassword(password);
    return {
      ...rest,
      password: hashedPassword,
    }
  }
  private async isUser(email: string): Promise < boolean > {
    const user = await this.getUser(email);
    return !!user;
  }

  private async getUser(email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  private async isUserVerified(email: string): Promise<boolean | undefined> {
    const user = await this.getUser(email);
    return user?.isVerified;
  }

  private async rejectUnverifiedUser(email: string): Promise<void> {
    const isVerified = await this.isUserVerified(email);
    if (!isVerified) {
      throw new UnauthorizedException({
        success: false,
        status: 401,
        message: "User is not verified",
      })
    }
  }

  private async rejectExistingUser(email: string): Promise<void> {
    const isExistingUser = await this.isUser(email);
    if (isExistingUser) {
      throw new UnauthorizedException({
        success: false,
        status: 401,
        message: "User already exists",
      });
    }
  }

  private async rejectNonExistingUser(email: string): Promise<void> {
    const isExistingUser = await this.isUser(email);
    if (!isExistingUser) {
      throw new UnauthorizedException({
        success: false,
        status: 401,
        message: "User does not exist",
      });
    }
  }
}
