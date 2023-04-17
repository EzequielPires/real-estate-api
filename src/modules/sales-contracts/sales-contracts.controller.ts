import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesContractsService } from './sales-contracts.service';
import { CreateSalesContractDto } from './dto/create-sales-contract.dto';
import { UpdateSalesContractDto } from './dto/update-sales-contract.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAdminGuard } from 'src/auth/guards/user-admin.guard';

@UseGuards(JwtAuthGuard, UserAdminGuard)
@Controller('sales-contracts')
export class SalesContractsController {
  constructor(private readonly salesContractsService: SalesContractsService) {}

  @Post()
  create(@Body() createSalesContractDto: CreateSalesContractDto) {
    return this.salesContractsService.create(createSalesContractDto);
  }

  @Get()
  findAll() {
    return this.salesContractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesContractsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesContractDto: UpdateSalesContractDto) {
    return this.salesContractsService.update(+id, updateSalesContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesContractsService.remove(+id);
  }
}
