import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ResendEmailDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    email: string;
}
