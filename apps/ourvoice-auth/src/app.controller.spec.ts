import { Test, TestingModule } from '@nestjs/testing';
import { SessionContainer } from 'supertokens-node/lib/build/recipe/session';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      let emptysession: SessionContainer;
      expect(appController.getTest(emptysession)).toBe('magic');
    });
  });
});
