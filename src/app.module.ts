import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FacilityModule } from './facility/facility.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, // ❗ chỉ dùng trong dev để tự tạo bảng
    }),
    UserModule,
    AuthModule,
    FacilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
