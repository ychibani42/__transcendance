import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

interface name {
	id : number
	sendname : string
}

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Post("Change")
	@UseGuards(JwtAuthGuard)
	changename(@Body() body:name){
		
		console.log("ID :",body.id)
		return this.userService.changename(body.id,body.sendname)
	}
}
