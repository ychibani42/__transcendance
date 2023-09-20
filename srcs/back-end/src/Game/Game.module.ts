import { Module } from '@nestjs/common';
import { GameService } from './Game.service';
import { GameGateway } from './Game.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { GameController } from './Game.controller';


@Module({
    controllers :[GameController],
    imports:[ScheduleModule.forRoot()],
    providers: [GameService,GameGateway],
    exports: [],
})

export class GameModule {}
