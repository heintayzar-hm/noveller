import { isUniqueUser } from '@server/decorators/isUniqueUser.decorator';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class BaseUserDto {
  @IsNotEmpty()
  @IsEmail()
  @isUniqueUser({ tableName: 'user', column: 'email' }, {
    message: 'Email $value already exists. Choose another email.',
   })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // optional username with validation
    @IsString()
    @MaxLength(20)
    @MinLength(3)
        @IsOptional()
  username?: string;
}
