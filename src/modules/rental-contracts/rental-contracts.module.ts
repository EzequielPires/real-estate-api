import { Module } from '@nestjs/common';
import { RentalContractsService } from './rental-contracts.service';
import { RentalContractsController } from './rental-contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalContract } from './entities/rental-contract.entity';
import { UsersModule } from '../users/users.module';
import { PropertiesModule } from '../properties/properties.module';
import { AddressModule } from '../address/address.module';
import { Doc } from 'src/services/doc';

@Module({
  imports: [TypeOrmModule.forFeature([RentalContract]), UsersModule, PropertiesModule, AddressModule],
  controllers: [RentalContractsController],
  providers: [RentalContractsService, Doc],
  exports: [RentalContractsService]
})
export class RentalContractsModule {}
