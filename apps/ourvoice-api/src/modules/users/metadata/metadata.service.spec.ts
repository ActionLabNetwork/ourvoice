import { Test, TestingModule } from '@nestjs/testing';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataService],
    }).compile();

    service = module.get<MetadataService>(MetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkDeployment', () => {
    it('should return true', async () => {
      const result = true;
      const adminId = 'ff2a9bb9-52c1-4d0a-84fd-9c4f1fd71bc7';
      const userId = '2a657d14-8091-4773-936b-97fb33fe04ae';
      jest
        .spyOn(service, 'checkDeployment')
        .mockImplementation(async () => result);

      expect(await service.checkDeployment(adminId, userId)).toBe(result);
    });
    it('should return false', async () => {
      const result = false;
      const adminId = undefined;
      const userId = undefined;
      jest
        .spyOn(service, 'checkDeployment')
        .mockImplementation(async () => result);

      expect(await service.checkDeployment(adminId, userId)).toBe(result);
    });
  });
});
