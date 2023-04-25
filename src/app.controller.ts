import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Doc } from './services/doc';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly docSercice: Doc
    ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('dashboard')
    dashboard() {
        return this.appService.dashboard();
    }
}
