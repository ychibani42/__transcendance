import {
	IsString,
	IsOptional,
	Length,
	IsNumber,
	IsBoolean,
} from 'class-validator';

export class UserDto {
	@IsString()
	@IsOptional()
	@Length(1, 50)
	public readonly avatar: string;

	@IsString()
	@IsOptional()
	@Length(1, 10)
	public readonly name: string;

	@IsNumber()
	public readonly id: number;
}
