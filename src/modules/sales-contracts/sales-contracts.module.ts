import { Module } from '@nestjs/common';
import { SalesContractsService } from './sales-contracts.service';
import { SalesContractsController } from './sales-contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesContract } from './entities/sales-contract.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesContract]), UsersModule],
  controllers: [SalesContractsController],
  providers: [SalesContractsService]
})
export class SalesContractsModule {}
