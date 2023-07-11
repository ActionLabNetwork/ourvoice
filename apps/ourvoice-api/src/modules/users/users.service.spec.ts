import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

const userMock = {
  user: {
    email: 'admin@ourvoice.app',
    id: '2a657d14-8091-4773-936b-97fb33fe04ae',
    timeJoined: 1686675203138,
  },
  recipeId: 'emailpassword',
};
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const result = {
        users: [
          { user: userMock, recipeId: 'emailpassword' },
          { user: userMock, recipeId: 'emailpassword' },
          { user: userMock, recipeId: 'emailpassword' },
          { user: userMock, recipeId: 'emailpassword' },
        ],
        nextPaginationToken: undefined,
      };
      jest.spyOn(service, 'getUsers').mockImplementation(async () => result);

      expect(await service.getUsers('emailpassword')).toBe(result);
    });
  });
});
