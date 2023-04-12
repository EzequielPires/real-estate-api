import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './modules/properties/entities/property.entity';
import { PropertiesService } from './modules/properties/properties.service';

@Injectable()
export class AppService {
  constructor(
    private propertyService: PropertiesService
  ) {}

  async getHello() {
    return await this.propertyService.findDataByDashboard();
  }

  async getDataDashboard() {
    
  }
}
