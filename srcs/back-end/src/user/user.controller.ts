import {
	Body,
	Controller,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
	Get,
	Res,
	NotFoundException,
	ParseIntPipe,
} from '@nestjs/common';

import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from './middleware/multer.config';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

interface name {
	id: number;
	name: string;
}

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('Change')
	@UseGuards(JwtAuthGuard)
	ChangeName(@Body() body: name): Promise<string | undefined> {
		console.log(body);
		return this.userService.ChangeName(body.id, body.name);
	}

	@Post('')
	@UseGuards(JwtAuthGuard)
	AllUser(@Body() body: any) {
		console.log("Body == " + body.id);
		return this.userService.findAll(body.id);
	}

	@Post('upload/:id')
	@UseInterceptors(FileInterceptor('file', MulterConfig))
	async uploadNewPP(
		@UploadedFile() file: any,
		@Param('id', ParseIntPipe) id: number,
	) {
		await this.userService.updatePP(id, file);
	}

	@Get('picture/:id')
	async getProfilePicture(@Param('id', ParseIntPipe) id: number, @Res() res) {
		const filename = await this.userService.findUser(id);
		if (!filename) {
			throw new NotFoundException();
		}
		console.log(process.cwd() + '/' + filename);
		if (filename.startsWith('http') || filename.startsWith('https')) {
			return res.redirect(filename);
		} else {
			res.sendFile(process.cwd() + '/' + filename);
		}
	}

	@Get('fetch/:id')
	async fetchUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findUserById(id);
	}
}
