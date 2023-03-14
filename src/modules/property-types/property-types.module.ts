import { Module } from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import { PropertyTypesController } from './property-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyType } from './entities/property-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType])],
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService]
})
export class PropertyTypesModule {}
