import { User } from '@app/users/entities';
import { UsersController } from '@app/users/users.controller';
import { UsersService } from '@app/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    findOne: jest.fn()
      .mockImplementation((username: string) => {
        const user = new User();
        user.username = username;
        return user;
      }),
    findAll: jest.fn()
      .mockImplementation(() => [new User()]),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findOne', () => {
    afterEach(() => {
      mockUsersService.findOne.mockClear();
    });

    it('should return user with specific username', async () => {
      const username = 'john';
      const user = await usersController.findOne(username);
      expect(user).toEqual({
        ...user,
        username,
      });
    });

    it('should call service.findOne() method', async () => {
      await usersController.findOne('john');
      expect(mockUsersService.findOne)
        .toBeCalled();
    });

    it('should call only service.findOne() method', async () => {
      await usersController.findOne('john');
      expect(mockUsersService.findOne)
        .toBeCalled();

      expect(mockUsersService.findAll)
        .toBeCalledTimes(0);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      mockUsersService.findAll.mockClear();
    });

    it('should return array of users', async () => {
      expect(await usersController.findAll())
        .toHaveProperty('length');
    });

    it('should call service.findAll() method', async () => {
      await usersController.findAll();
      expect(mockUsersService.findAll)
        .toBeCalled();
    });
  });
});