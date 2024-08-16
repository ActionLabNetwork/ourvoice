import {
  // INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma-moderation-db/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        moderation: {
          url:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_MODERATION_TEST_URL ||
                'postgresql://your_db_user:your_db_password@127.0.0.1:5437/ourvoice_db_mod_test'
              : process.env.DATABASE_MODERATION_URL ||
                'postgresql://your_db_user:your_db_password@127.0.0.1:5435/ourvoice_db_mod?schema=ourvoice&sslmode=prefer',
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

  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }
}
