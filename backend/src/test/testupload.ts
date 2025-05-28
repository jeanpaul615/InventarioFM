import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as path from 'path';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products/upload (POST) should upload file', async () => {
    const filePath = path.join(__dirname, 'test.xlsx');
    return request(app.getHttpServer())
      .post('/products/upload')
      .attach('file', filePath)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});