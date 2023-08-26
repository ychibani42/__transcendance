import { Module } from '@nestjs/common';
import { GameService } from './Game.service';
import { GameGateway } from './Game.gateway';

@Module({
    imports:[],
    providers: [GameService,GameGateway],
    exports: [],
})

export class GameModule {}
