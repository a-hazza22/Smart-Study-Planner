import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // تفعيل CORS ليتمكن الفرونت اند من الاتصال
  app.enableCors();
  await app.listen(3001);
  console.log(`🚀 Server is running on: http://localhost:3001`);
}
bootstrap();