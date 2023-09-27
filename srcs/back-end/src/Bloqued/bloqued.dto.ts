import { IsInt } from 'class-validator';

export class BloquedDto {
	@IsInt()
	id: number;
}

export class AddBloquedDto {
	@IsInt()
	id: number;

	@IsInt()
	addid: number;
}
