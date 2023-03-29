import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailsService } from './details.service';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';

@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  create(@Body() createDetailDto: CreateDetailDto) {
    return this.detailsService.create(createDetailDto);
  }

  @Get()
  findAll() {
    return this.detailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailDto: UpdateDetailDto) {
    return this.detailsService.update(+id, updateDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailsService.remove(+id);
  }
}
