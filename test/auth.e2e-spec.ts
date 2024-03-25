import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as userMocks from "./__mock__/user.mock" 

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const registerUserData = userMocks.getRegisterUserData()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/register POST', () => {
    const resp = request(app.getHttpServer()).post('/auth/register').send(registerUserData);

    console.log(resp)
  });
});
