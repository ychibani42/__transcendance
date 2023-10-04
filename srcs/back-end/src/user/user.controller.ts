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
import { UserDto } from './dtos';
import { Express } from 'express';

interface name {
	id: number;
	name: string;
}

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('Change')
	@UseGuards(JwtAuthGuard)
	ChangeName(@Body() body: UserDto): Promise<string | undefined> {
		return this.userService.ChangeName(body.id, body.name);
	}

	@Post('')
	@UseGuards(JwtAuthGuard)
	AllUser(@Body() body: UserDto) {
		return this.userService.findAll(body.id);
	}

	@Post('upload/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file', MulterConfig))
	async uploadNewPP(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile() file: Express.Multer.File,
	) {
		await this.userService.updatePP(id, file);
	}

	@Get('picture/:id')
	@UseGuards(JwtAuthGuard)
	async getProfilePicture(@Param('id', ParseIntPipe) id: number, @Res() res) {
		const filename = await this.userService.findUser(id);
		if (!filename) {
			throw new NotFoundException();
		}
		if (filename.startsWith('http') || filename.startsWith('https')) {
			return res.redirect(filename);
		} else {
			res.sendFile(process.cwd() + '/' + filename);
		}
	}

	@Get('fetch/:id')
	@UseGuards(JwtAuthGuard)
	async fetchUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findUserById(id);
	}
}
