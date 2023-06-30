import { Test, TestingModule } from '@nestjs/testing';
import { SupertokensService } from './supertokens.service';
import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';

const mockAppInfo = {
  appName: 'TestApp',
  websiteDomain: 'http://auth.ourvoice.test',
  apiDomain: 'http://authapi.ourvoice.test',
};
const mockSMTPConfig = {
  host: 'sandbox.smtp.mailtrap.io',
  user: 'username',
  password: 'password',
  port: '2525',
};

const mockAuthConfig = {
  appInfo: mockAppInfo,
  connectionURI: 'http://localhost:3567',
  smtpSettings: mockSMTPConfig,
  authBypassTest: {
    isTestMode: false,
    createCode: {
      preAuthSessionId: '12345',
      codeId: '12345',
      deviceId: '12345',
      userInputCode: '12345',
      linkCode: '12345',
    },
    consumeCode: {
      id: '12345',
      email: 'email@email.com',
      timeJoined: 12345,
    },
  },
};

describe('SupertokensService', () => {
  let service: SupertokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupertokensService,
        { provide: ConfigInjectionToken, useValue: mockAuthConfig },
      ],
    }).compile();

    service = module.get<SupertokensService>(SupertokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
