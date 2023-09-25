import {IsInt} from 'class-validator';

export class FriendDto{
    @IsInt()
    id : number;
}

export class AddFriendDto{
    @IsInt()
    id : number;

    @IsInt()
    addid : number;
}