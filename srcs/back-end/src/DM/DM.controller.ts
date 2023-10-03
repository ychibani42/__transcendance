import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DMservice } from './DM.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';
// import { CreateDMDto } from './create-DM.dto';

// @UseGuards
@Controller('dm')
@UseGuards(JwtAuthGuard)
export class DMController {
	constructor(private readonly dmService: DMservice,
		private readonly userService: UserService) {}
}
