import { Module } from "@nestjs/common";
import { DMService } from './DM.service';
import { DMGateway } from './DM.gateway';
import { DMController } from './DM.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [PrismaModule, UserModule],
	providers: [DMGateway, DMService],
})
export class DMModule {}
