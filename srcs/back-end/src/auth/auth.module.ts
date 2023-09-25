import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "./Strategy/jwt-strategy";
import {FortyTwoStrategy} from "./Strategy/42.strategy";
import { StateService } from './Gateaway/state.service';
import { StateGateway } from './Gateaway/State.gateaway';

@Module({
	imports: [
		PrismaModule,
		UserModule,
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_ACCESS_TOKEN,
			signOptions: { expiresIn: '3h' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService,FortyTwoStrategy,JwtStrategy,StateService,StateGateway],
	exports: [AuthService],
})
export class AuthModule {}
