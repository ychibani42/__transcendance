import { IsBoolean, IsNumber } from "class-validator";

export class leaveDto {
    @IsNumber()
    public readonly chatId: number;

    @IsNumber()
    public readonly userId: number;
}