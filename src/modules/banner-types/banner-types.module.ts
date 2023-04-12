import { Module } from '@nestjs/common';
import { BannerTypesService } from './banner-types.service';
import { BannerTypesController } from './banner-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerType } from './entities/banner-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannerType])],
  controllers: [BannerTypesController],
  providers: [BannerTypesService]
})
export class BannerTypesModule {}
