import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { PropertiesModule } from '../properties/properties.module';
import { RentalContractsModule } from '../rental-contracts/rental-contracts.module';
import { NodemailerService } from 'src/services/nodemailer/nodemailer';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), PropertiesModule, RentalContractsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, NodemailerService],
  exports: [InvoicesService]
})
export class InvoicesModule {}
