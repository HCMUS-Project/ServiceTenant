import { Module } from '@nestjs/common';
import { PolicyAndTermService } from './policyandterm.service';
import { PolicyAndTermController } from './policyandterm.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PolicyAndTermController],
    providers: [PolicyAndTermService],
    exports: [PolicyAndTermService],
})
export class PolicyAndTermModule {}
