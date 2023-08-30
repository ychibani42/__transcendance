import { IsNumber} from 'class-validator';

export class ChatDto {
	@IsNumber()
    id: number;
}
