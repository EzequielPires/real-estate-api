import { Module } from '@nestjs/common';
import { RentalContractsService } from './rental-contracts.service';
import { RentalContractsController } from './rental-contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalContract } from './entities/rental-contract.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RentalContract]), UsersModule],
  controllers: [RentalContractsController],
  providers: [RentalContractsService]
})
export class RentalContractsModule {}
