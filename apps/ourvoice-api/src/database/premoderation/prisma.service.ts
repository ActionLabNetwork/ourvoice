import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@internal/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        premoderation: {
          url:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_PREMODERATION_TEST_URL ||
                'postgresql://your_db_user:your_db_password@127.0.0.1:5437/ourvoice_db_pre_test'
              : process.env.DATABASE_PREMODERATION_URL ||
                'postgresql://your_db_user:your_db_password@127.0.0.1:5435/ourvoice_db_pre?schema=ourvoice&sslmode=prefer',
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
