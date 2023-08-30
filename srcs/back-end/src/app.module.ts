import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './Game/Game.module';

@Module({
	imports: [UserModule, AuthModule, PrismaModule, ChatModule, GameModule],
})
export class AppModule {}
