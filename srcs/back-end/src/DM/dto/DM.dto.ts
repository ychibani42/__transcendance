import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class DMDto {
    @IsOptional()
    @IsNumber()
    public readonly user1: number;

    @IsOptional()
    @IsNumber()
    public readonly user2: number;

    @IsOptional()
    @IsNumber()
    public readonly oldRoom: number;

    @IsOptional()
    @IsString()
    public readonly name: string;

}