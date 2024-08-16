import {
  // INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma-main-db/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // TODO: look into using configurationservice to get the connection strings
  // test failed with it???
  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_MAIN_TEST_URL ||
                'postgresql://your_db_user:your_db_password@127.0.0.1:5436/ourvoice_db_test'
              : process.env.DATABASE_MAIN_URL ||
                'postgresql://your_db_user:your_db_password@127.0.0.1:5433/ourvoice_db?schema=ourvoice&sslmode=prefer',
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
