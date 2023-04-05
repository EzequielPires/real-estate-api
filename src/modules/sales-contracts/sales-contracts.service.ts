import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateSalesContractDto } from './dto/create-sales-contract.dto';
import { UpdateSalesContractDto } from './dto/update-sales-contract.dto';
import { SalesContract } from './entities/sales-contract.entity';
import { PropertiesService } from '../properties/properties.service';
import { Status } from 'src/enums/property.enum';

@Injectable()
export class SalesContractsService {
  constructor(
    @InjectRepository(SalesContract) private salesContractRepository: Repository<SalesContract>,
    private userService: UsersService,
    private propertiesService: PropertiesService
  ) {}

  async create(createSalesContractDto: CreateSalesContractDto) {
    try {
      const {property, owner, buyer, seller, price} = createSalesContractDto;
      console.log(property.id);
      const propertyAlreadyExists = await this.salesContractRepository.findOne({where: {
        property: {
          id: property.id
        }
      }});
      
      if(property && propertyAlreadyExists) throw new Error('Já existe um contrado de venda.');
      
      if (owner) {
        const ownerExists = await this.userService.findOne(owner.id).then(res => res.user);
        if (owner && !ownerExists || ownerExists.role != Role.owner) throw new Error('Owner invalid.');
      }
      
      if (buyer) {
        const buyerExists = await this.userService.findOne(buyer.id).then(res => res.user);
        if (buyer && !buyerExists || buyerExists.role != Role.customer) throw new Error('Buyer invalid.');
      }
      
      if (seller) {
        const sellerExists = await this.userService.findOne(seller.id).then(res => res.user);
        if (seller && !sellerExists || sellerExists.role != Role.realtor) throw new Error('Seller invalid.');
      }
      
      const contract = this.salesContractRepository.create({
        ...createSalesContractDto,
        price: price.replace(/[^0-9]/g, '')
      });
      
      await this.propertiesService.updateStatus(property.id, Status.vendido);

      return {
        success: true,
        contract: await this.salesContractRepository.save(contract)
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
        results: await this.salesContractRepository.find()
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} salesContract`;
  }

  update(id: number, updateSalesContractDto: UpdateSalesContractDto) {
    return `This action updates a #${id} salesContract`;
  }

  async remove(id: number) {
    try {
      const contract = await this.salesContractRepository.findOne({where: {id}, relations: ['property']});
      if(!contract) throw new Error('Contrato de venda não encontrado');

      await this.salesContractRepository.delete(id);
      await this.propertiesService.updateStatus(contract.property.id, Status.disponivel);

      return {
        success: true,
        message: 'Contrato de venda removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
