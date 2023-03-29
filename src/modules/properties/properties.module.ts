import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { UsersModule } from '../users/users.module';
import { AddressModule } from '../address/address.module';
import { DetailsModule } from '../details/details.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), UsersModule, AddressModule, DetailsModule],
  controllers: [PropertiesController],
  providers: [PropertiesService]
})
export class PropertiesModule {}
