import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    code: number;

}
