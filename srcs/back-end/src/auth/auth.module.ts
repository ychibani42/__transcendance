import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [PrismaModule,
		UserModule,
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_ACCESS_TOKEN,
			signOptions: {expiresIn: '60s'},
		})
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})

export class AuthModule {}
