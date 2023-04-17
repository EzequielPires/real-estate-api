import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Doc } from './services/doc';

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

  @Get('generate-contract')
  generateContract() {
    return this.docSercice.generateContract()
  }
}
