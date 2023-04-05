import { Module } from '@nestjs/common';
import { RentalContractsService } from './rental-contracts.service';
import { RentalContractsController } from './rental-contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalContract } from './entities/rental-contract.entity';
import { UsersModule } from '../users/users.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [TypeOrmModule.forFeature([RentalContract]), UsersModule, PropertiesModule],
  controllers: [RentalContractsController],
  providers: [RentalContractsService]
})
export class RentalContractsModule {}
