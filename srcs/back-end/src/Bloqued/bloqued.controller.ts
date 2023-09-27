import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BloquedService } from './bloqued.service';
import { BloquedDto, AddBloquedDto } from './bloqued.dto';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

@Controller('Bloqued')
export class BloquedController {
	constructor(private BloquedService: BloquedService) {}

	@Post('')
	@UseGuards(JwtAuthGuard)
	GetBloquedsList(@Body() id: BloquedDto) {
		const Bloqued = this.BloquedService.bloquedlist(id.id);
		return Bloqued;
	}

	@Post('add')
	@UseGuards(JwtAuthGuard)
	AddBloqueds(@Body() req: AddBloquedDto) {
		const Bloqued = this.BloquedService.addbloqued(req.id, req.addid);
		return Bloqued;
	}
}
