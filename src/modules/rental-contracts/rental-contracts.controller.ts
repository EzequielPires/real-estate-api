import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalContractsService } from './rental-contracts.service';
import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';

@Controller('rental-contracts')
export class RentalContractsController {
  constructor(private readonly rentalContractsService: RentalContractsService) {}

  @Post()
  create(@Body() createRentalContractDto: CreateRentalContractDto) {
    return this.rentalContractsService.create(createRentalContractDto);
  }

  @Get()
  findAll() {
    return this.rentalContractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalContractsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalContractDto: UpdateRentalContractDto) {
    return this.rentalContractsService.update(+id, updateRentalContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalContractsService.remove(+id);
  }
}
