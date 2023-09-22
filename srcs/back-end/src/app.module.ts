import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './Game/Game.module';
import { FriendModule } from './friend/friend.module';
import { BloquedModule } from './Bloqued/bloqued.module';

@Module({
	imports: [UserModule, AuthModule, PrismaModule, ChatModule, GameModule , FriendModule,BloquedModule],
})
export class AppModule {}
