import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from '@server/decorators/isEqualTo.decorator';
import { BaseUserDto } from '@server/users/dto/base-user.dto';
import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterDto extends BaseUserDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    })
    password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsEqualTo('password')
  passwordConfirmation: string;


}
