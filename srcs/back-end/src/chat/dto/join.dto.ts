import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class joinDto {
    @IsOptional()
    @IsNumber()
    public readonly chatId: number;

    @IsOptional()
    @IsNumber()
    public readonly userId: number;

    @IsOptional()
    @IsNumber()
    public readonly oldChatId: number;

    @IsOptional()
    @IsString()
    public readonly pass: string;

    @IsOptional()
    @IsBoolean()
    public readonly status: boolean;
}