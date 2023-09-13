import { Module } from '@nestjs/common';
import { GameService } from './Game.service';
import { GameGateway } from './Game.gateway';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    imports:[ScheduleModule.forRoot()],
    providers: [GameService,GameGateway],
    exports: [],
})

export class GameModule {}
