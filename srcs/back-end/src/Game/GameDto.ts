
import {IsNotEmpty,IsInt, IsString} from 'class-validator';

export class NameDto{
  
    @IsNotEmpty()
    @IsString()
    name: string;
}