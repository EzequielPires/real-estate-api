import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';
import { RentalContract } from './entities/rental-contract.entity';
import { PropertiesService } from '../properties/properties.service';
import { Status } from 'src/enums/property.enum';

@Injectable()
export class RentalContractsService {
  constructor(
    @InjectRepository(RentalContract) private rentalContractRepository: Repository<RentalContract>,
    private userService: UsersService,
    private propertiesService: PropertiesService
  ) { }

  async create(createRentalContractDto: CreateRentalContractDto) {
    const { owner, tenant, property, price } = createRentalContractDto;
    try {
      const rentalContractAlreadyExists = await this.rentalContractRepository.findOne({ where: { property: { id: property.id } } })

      if (rentalContractAlreadyExists) throw new Error('Já existe um contrato criado para esse imóvel.');

      if (owner) {
        const ownerExists = await this.userService.findOne(owner.id).then(res => res.user);
        if (owner && !ownerExists || ownerExists.role != Role.owner) throw new Error('Owner invalid.');
      }

      if (tenant) {
        const tenantExists = await this.userService.findOne(tenant.id).then(res => res.user);
        if (tenant && !tenantExists || tenantExists.role != Role.customer) throw new Error('Tenant invalid.');
      }

      const contract = this.rentalContractRepository.create({
        ...createRentalContractDto,
        price: price.replace(/[^0-9]/g, '')
      });

      await this.propertiesService.update(property.id, {status: Status.vendido});

      return {
        success: true,
        contract: await this.rentalContractRepository.save(contract)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll() {
    try {
      return {
        success: true,
        results: await this.rentalContractRepository.find()
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: number) {
    try {
      const contract = await this.rentalContractRepository.findOne({where: {id}, relations: ['property', 'locator']});

      if(!contract) throw new Error('Contrato de locação não encontrado.');

      return {
        success: true,
        result: contract
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  update(id: number, updateRentalContractDto: UpdateRentalContractDto) {
    return `This action updates a #${id} rentalContract`;
  }

  remove(id: number) {
    return `This action removes a #${id} rentalContract`;
  }
}
