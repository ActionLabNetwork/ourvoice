import { VoteResolver } from './vote.resolver';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VoteRepository, VoteService, VoteResolver],
  exports: [VoteService],
})
export class VoteModule {}
