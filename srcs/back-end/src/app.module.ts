import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';

@Module({
	imports: [UserModule, AuthModule, PrismaModule, ChatModule, MessagesModule],
})
export class AppModule {}
