import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class NotificationDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty()
    @IsString({ each: true })
    @IsNotEmpty()
    @IsArray()
    notifications: string[];
}