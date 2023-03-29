import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detail } from './entities/detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Detail])],
  controllers: [DetailsController],
  providers: [DetailsService],
  exports: [DetailsService]
})
export class DetailsModule {}
