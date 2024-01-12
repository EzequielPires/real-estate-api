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
import { AddressService } from '../address/address.service';
import { Doc } from 'src/services/doc';
import { FindRentalContractDto } from './dto/find-rental-contract.dto';

@Injectable()
export class RentalContractsService {
  constructor(
    @InjectRepository(RentalContract) private rentalContractRepository: Repository<RentalContract>,
    private userService: UsersService,
    private propertiesService: PropertiesService,
    private addressService: AddressService,
    private readonly docSercice: Doc
  ) { }

  async create(createRentalContractDto: CreateRentalContractDto) {
    const { owner, tenant, property, price, address, shorts } = createRentalContractDto;
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

      const newAddress = address ? await this.addressService.create(address) : null;

      const contract = this.rentalContractRepository.create({
        ...createRentalContractDto,
        price: price.replace(/[^0-9]/g, ''),
        shorts: shorts ? shorts.replace(/[^0-9]/g, '') : null,
        address: newAddress
      });

      await this.propertiesService.update(property.id, { status: Status.vendido });

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

  async findAll(queryDto?: FindRentalContractDto) {
    try {
      const { limit, page, code } = queryDto;
      const query = this.rentalContractRepository.createQueryBuilder('r')
        .leftJoinAndSelect('r.property', 'property')
        .leftJoinAndSelect('property.address', 'address')
        .leftJoinAndSelect('property.type', 'type')
        .leftJoinAndSelect('address.district', 'district')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('address.state', 'state')
        .skip(page ? (limit ?? 15) * (page - 1) : 0)
        .take(limit ?? 15)
        .orderBy("r.end", 'DESC');

        {code && query.andWhere('property.code = :code', {code})}

      const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results,
        total,
        page: queryDto.page ? Number(queryDto.page) : 1,
        limit: queryDto.limit ? Number(queryDto.limit) : 15,
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
      const contract = await this.rentalContractRepository.findOne({ where: { id }, relations: ['property', 'property.pickup', 'locator'] });

      if (!contract) throw new Error('Contrato de locação não encontrado.');

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

  async update(id: number, updateRentalContractDto: UpdateRentalContractDto) {
    try {
      const { price, address, shorts } = updateRentalContractDto;
      let newAddress;
      const contract = await this.rentalContractRepository.findOne({ where: { id }, relations: ['property', 'property.pickup', 'locator', 'address'] });

      if (!contract) throw new Error('Contrato de locação não encontrado.');

      if (address) {
        newAddress = await this.addressService.update(contract.address.id, address);
      }

      await this.rentalContractRepository.update(id, {
        ...updateRentalContractDto,
        address: newAddress ?? contract.address,
        price: price.replace(/[^0-9]/g, ''),
        shorts: shorts ? shorts.replace(/[^0-9]/g, '') : null,
      });

      return {
        success: true,
        result: await this.rentalContractRepository.findOne({ where: { id }, relations: ['property', 'property.pickup', 'locator', 'address'] }),
        message: 'Contrato de locação atualizado com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const contract = await this.rentalContractRepository.findOne({ where: { id }, relations: ['property', 'property.pickup', 'locator'] });

      if (!contract) throw new Error('Contrato de locação não encontrado.');

      await this.rentalContractRepository.delete(id);

      return {
        success: true,
        message: 'Contrato de locação removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async generateDocument(id: number) {
    try {
      const contract = await this.rentalContractRepository.findOne({ where: { id }, relations: ['property', 'tenant', 'address'] });

      if (!contract) throw new Error('Contrato de locação não encontrado.');

      const path = await this.docSercice.generateContract(contract);

      if (!path) throw new Error('Não foi possível gerar o documento de contrato de locação, entre em contato com o suporte.');

      await this.rentalContractRepository.update(id, {
        document: path
      });

      return {
        success: true,
        result: await this.rentalContractRepository.findOne({ where: { id }, relations: ['property', 'property.pickup', 'locator', 'tenant', 'address'] }),
        message: 'Contrato de locação atualizado com sucesso',
        path
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async uploadImage(id: number, path: string) {
    try {
      const contract = await this.rentalContractRepository.findOne({ where: { id } });

      if (!contract) throw new Error('Contrato de locação não encontrada.');
      if (!contract.images) contract.images = [];

      contract.images.push(path);

      await this.rentalContractRepository.update(id, contract);

      return {
        success: true,
        images: contract.images,
        message: 'Contrato de locação atualizado com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
