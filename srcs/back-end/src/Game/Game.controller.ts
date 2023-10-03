import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GameService } from './Game.service';
import { NameDto } from './GameDto';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

@Controller('game')
export class GameController {
	constructor(private GameService: GameService) {}

	@Get('all')
	@UseGuards(JwtAuthGuard)
	getallgames() {
		const games = this.GameService.getallgame();
		return games;
	}

	@Post('Findbyname')
	@UseGuards(JwtAuthGuard)
	ResearchHistory(@Body() name: NameDto) {
		const games = this.GameService.research(name.name);
		return games;
	}
}
