import { Body, Controller, Get, Param, ParseArrayPipe, Post, UseGuards } from '@nestjs/common';
import { GameService } from './Game.service';

@Controller('game')
export class GameController {
	constructor(private GameService: GameService) {}

    @Get('all')
    getallgames(){
        const games = this.GameService.getallgame()
        return games
    }

    @Get(':name')
    ResearchHistory(@Param('name',ParseArrayPipe) name : string){
        console.log(name[0])
        console.log(name)
        const games = this.GameService.research(name[0])
        return games
    }
}
