import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DMservice } from './DM.service';
import { UserService } from 'src/user/user.service';
// import { CreateDMDto } from './create-DM.dto';

// @UseGuards
@Controller('dm')
export class DMController {
	constructor(private readonly dmService: DMservice,
		private readonly userService: UserService) {}

}
