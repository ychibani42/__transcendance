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
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from './middleware/multer.config';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file', MulterConfig))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log("[" + file + "]");
	}
}
