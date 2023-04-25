import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './modules/properties/entities/property.entity';
import { PropertiesService } from './modules/properties/properties.service';
import { LeadsService } from './modules/leads/leads.service';
import { SalesContractsService } from './modules/sales-contracts/sales-contracts.service';
import { InvoicesService } from './modules/invoices/invoices.service';

@Injectable()
export class AppService {
  constructor(
    private propertyService: PropertiesService,
    private leadService: LeadsService,
    private salesContractsService: SalesContractsService,
    private invoiceService: InvoicesService
  ) { }

  async getHello() {
    return await this.propertyService.findDataByDashboard();
  }

  async dashboard() {
    return {
      properties: await this.propertyService.findDataByDashboard(),
      propertiesByMonth: await this.propertyService.countPropertiesByTypeAndMonth(),
      leads: await this.leadService.findAll({
        limit: 4,
      }).then(res => res.results),
      salesContracts: await this.salesContractsService.countContractsByMonth(),
      rentalContracts: await this.invoiceService.countContractsByMonth(),
    };
  }
}
