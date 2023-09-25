import { Module } from '@nestjs/common';
import { BloquedService } from './bloqued.service';
import { BloquedController } from './bloqued.controller';

@Module({
	providers: [BloquedService],
	exports: [BloquedService],
	controllers: [BloquedController],
})
export class BloquedModule {}
