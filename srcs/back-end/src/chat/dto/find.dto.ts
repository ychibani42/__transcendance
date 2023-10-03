import { IsBoolean, IsNumber } from "class-validator";

export class findDto {
    @IsNumber()
    public readonly id: number;
}