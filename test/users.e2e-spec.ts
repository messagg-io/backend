import { UsersModule } from '@app/users/users.module';
import { UsersService } from '@app/users/users.service';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('Users', () => {
  let app: INestApplication;

  const mockUsersService = {
    findAll: jest.fn()
      .mockImplementation(() => {
        return ['user1', 'user2'];
      }),
    findOne: jest.fn()
      .mockImplementation((username: string) => {
        return username;
      }),
    create: jest.fn()
      .mockImplementation((username: string) => {
        return username;
      })
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot('mongodb://localhost/messaggio'),
          UsersModule,
        ],
      })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });

  it('GET /users/:username', () => {
    return request(app.getHttpServer())
      .get(`/users/user1`)
      .expect(200);
  });

  it('POST /users', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send('userNew')
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});