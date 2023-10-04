import { IsArray, IsBoolean, IsNumber, IsOptional, isNumber } from "class-validator";
import { UserDto } from "src/user/dtos";
import { admin } from "../interfaces/adminInterface";


export class kickDto {
    @IsNumber()
    public readonly chatId: number;

    @IsArray()
    public readonly userId: number[];

    @IsOptional()
    @IsNumber()
    public readonly duration: number;
}