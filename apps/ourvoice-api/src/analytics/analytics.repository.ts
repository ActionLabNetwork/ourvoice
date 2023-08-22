import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/moderation/prisma.service';
import { Prisma } from '@prisma-moderation-db/client';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createApiCallRecord(record: Prisma.ApiCallRecordCreateArgs) {
    return this.prisma.apiCallRecord.create(record);
  }
}
