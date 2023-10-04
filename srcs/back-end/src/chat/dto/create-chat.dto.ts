import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateChatDto {
	// @IsNumber()
    // public readonly id: number;

	@IsString()
	@Length(1, 15)
	channelName: string;

	@IsBoolean()
	@IsOptional()
	is_private: boolean;

	@IsOptional()
	password: string;

	@IsBoolean()
	@IsOptional()
	dm: boolean;

	@IsNumber()
	ownerId: number;
}
