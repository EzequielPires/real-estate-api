import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Property } from '../properties/entities/property.entity';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { District } from './entities/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Property, City, State, District])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
