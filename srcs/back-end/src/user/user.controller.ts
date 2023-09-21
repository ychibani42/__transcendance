import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
	Req,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from './middleware/multer.config';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

interface name {
	id : number
	sendname : string
}

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file', MulterConfig))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log("[" + file + "]");
	}

	@Post("Change")
	@UseGuards(JwtAuthGuard)
	changename(@Body() body: name){
		console.log("ID :",body.id)
		return this.userService.changename(body.id,body.sendname)
	}
}
