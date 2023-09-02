import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateChatDto {
	@IsString()
	@Length(1, 15)
	channelName: string;

	@IsBoolean()
	is_private: boolean;

	@IsOptional()
	password?: string | undefined;

	@IsBoolean()
	@IsOptional()
	dm: boolean;

	@IsNumber()
	ownerId: number;
}
