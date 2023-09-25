import { Body, Controller, Get, Param, ParseArrayPipe, Post, UseGuards } from '@nestjs/common';
import { GameService } from './Game.service';
import { NameDto } from './GameDto';

@Controller('game')
export class GameController {
	constructor(private GameService: GameService) {}

    @Get('all')
    getallgames(){
        const games = this.GameService.getallgame()
        return games
    }

    @Post('Findbyname')
    ResearchHistory(@Body() name: NameDto){
        const games = this.GameService.research(name.name)
        return games
    }
}
