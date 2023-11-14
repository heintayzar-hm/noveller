import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User as UserEntity,
} from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationService } from '@server/services/email/email-verification.service';
export type User = {
  userId: number;
  username: string;
  email: string;
  password: string;
};
@Injectable()
export class UsersService {
  private readonly emailVerificationService: EmailVerificationService;
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private configService: ConfigService, // Inject the ConfigService
  ) {
    this.emailVerificationService = new EmailVerificationService(this.configService, "");
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      const dto = await this.usersRepository.save(user);
      return {
        user: new UserEntity(dto),
        success: true,
        status: HttpStatus.CREATED,
      }
    }
    catch (err) {
      throw err;
    }
  }

  async verifiedEmail(id: number, code: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        return {
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: "User not found",
        }
      }
      if (user.code !== code) {
        return {
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: "Code is not correct",
        }
      }
      const dto = this.usersRepository.merge(user, { isVerified: true, code: undefined });
      await this.usersRepository.save(dto);
      return {
        user: new UserEntity(dto),
        success: true,
        status: HttpStatus.OK,
      }
    }
    catch (err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async sendVerificationEmail(dto: UserEntity) {
    return await this.emailVerificationService.sendVerificationEmail(dto.email, dto.code, dto.username || dto.email?.split("@")[0]);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } }) as UserEntity;
    const dto = this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(dto);
    return {
      user: new UserEntity(dto),
      success: true,
      status: HttpStatus.OK,
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async isVerified(id: number): Promise<boolean> {
    return this.usersRepository.findOne({ where: { id } }).then((user) => {
      if (user) {
        return user.isVerified;
      }
      return false;
    });
  }
}
