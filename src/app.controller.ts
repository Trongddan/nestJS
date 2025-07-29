import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('hello')
  getHello1(): string {
    console.log('Người dùng đã truy cập vào đường dẫn /hello');
    return this.appService.getHello2();
  }
}
