import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';
import { readFile, unlink } from 'fs';
import { AddressService } from '../address/address.service';
import { DetailsService } from '../details/details.service';
import { Detail } from '../details/entities/detail.entity';
import { UsersService } from '../users/users.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FindPropertyDto } from './dto/find-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { Status } from 'src/enums/property.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PropertiesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Property) private propertyRepository: Repository<Property>,
    private userService: UsersService,
    private addressService: AddressService,
    private detailsService: DetailsService,
  ) { }

  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const { owner, pickup, address, images, price, iptu, exemptIptu } = createPropertyDto;
      if (owner && owner.id) {
        const ownerExists = await this.userService.findOne(owner.id).then(res => res.user);
        if (owner && !ownerExists || ownerExists.role != Role.owner) throw new Error('Owner invalid.');
      }

      if (pickup && pickup.id) {
        const pickupExists = await this.userService.findOne(pickup.id).then(res => res.user);
        if (pickup && !pickupExists || pickupExists.role != Role.realtor) throw new Error('Pickup invalid.');
      }

      const newAddress = await this.addressService.create(address);

      const code = await this.codeGenerator(5);

      const property = this.propertyRepository.create({
        ...createPropertyDto,
        address: newAddress,
        code,
        images: images ?? [],
        exemptIptu: exemptIptu === false || exemptIptu === null ? false : true,
        price: price.replace(/[^0-9]/g, ''),
        iptu: iptu.replace(/[^0-9]/g, ''),
      })

      return {
        success: true,
        property: await this.propertyRepository.save(property)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async findAll(queryDto: FindPropertyDto) {
    try {
      const { limit, page, adType, cityId, code, districtId, emphasis, priceMax, priceMin, realtorId, stateId, status, typeId } = queryDto;

      const query = this.propertyRepository.createQueryBuilder('property')
        .leftJoinAndSelect('property.address', 'address')
        .leftJoinAndSelect('address.state', 'state')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('address.district', 'district')
        .leftJoinAndSelect('property.owner', 'owner')
        .leftJoinAndSelect('property.pickup', 'pickup')
        .leftJoinAndSelect('property.type', 'type')
        .skip(page ? (limit ?? 15) * (page - 1) : 0)
        .take(limit ?? 15)
        .orderBy("property.createdAt", 'DESC');

      { adType && query.andWhere('property.adType = :adType', { adType }) }
      { code && query.andWhere('property.code = :code', { code }) }
      console.log(emphasis);
      { emphasis === 'true' && query.andWhere('property.emphasis = 1', { emphasis }) }
      { status && query.andWhere('property.status = :status', { status }) }
      { typeId && query.andWhere('type.id = :typeId', { typeId }) }
      { stateId && query.andWhere('state.id = :stateId', { stateId }) }
      { cityId && query.andWhere('city.id = :cityId', { cityId }) }
      { districtId && query.andWhere('district.id = :districtId', { districtId }) }
      { realtorId && query.andWhere('pickup.id = :realtorId', { realtorId }) }
      { priceMax && query.andWhere('district.id = :priceMax', { priceMax: priceMax.replace(/[^0-9]/g, '') }) }
      { priceMin && query.andWhere('district.id = :priceMin', { priceMin: priceMin.replace(/[^0-9]/g, '') }) }

      const [results, count] = await query.getManyAndCount();

      return {
        success: true,
        results,
        count,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
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
      const property = await this.propertyRepository.findOne({ where: { id }, relations: ['address', 'type', 'details', 'owner', 'pickup'] });

      if (!property) throw new Error('Propriedade não encontrada.');

      return {
        success: true,
        property
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOneByCode(code: string) {
    try {
      const property = await this.propertyRepository.findOne({ where: { code }, relations: ['address', 'type', 'details', 'owner', 'pickup'] });

      if (!property) throw new Error('Propriedade não encontrada.');

      return {
        success: true,
        property
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    try {
      let newAddress;
      const { images, exemptIptu, price, iptu, type, condominium, address } = updatePropertyDto;

      const property = await this.propertyRepository.findOne({ where: { id }, relations: ['address'] });

      if (address) {
        newAddress = await this.addressService.update(property.address.id, address);
      }

      if (!property) throw new Error('Propriedade não encontrada.');

      const { details, ...data } = updatePropertyDto;
      await this.propertyRepository.update(id, {
        ...data,
        address: newAddress ?? property.address,
        code: property.code,
        images: images ?? [],
        exemptIptu: exemptIptu === false || exemptIptu === null ? false : true,
        price: price.replace(/[^0-9]/g, ''),
        condominium: condominium.replace(/[^0-9]/g, ''),
        iptu: iptu.replace(/[^0-9]/g, ''),
      });


      return {
        success: true,
        property: await this.addDetails(id, details),
        message: 'Propriedade atualizada com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async changeEmphasis(id: number, updatePropertyDto: UpdatePropertyDto) {
    try {
      const { emphasis } = updatePropertyDto;

      const property = await this.propertyRepository.findOne({ where: { id }, relations: ['address'] });
      property.emphasis = emphasis;

      if (!property) throw new Error('Propriedade não encontrada.');

      await this.propertyRepository.update(id, {
        emphasis
      });


      return {
        success: true,
        property: property,
        message: 'Propriedade atualizada com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async changeStatus(id: number, updatePropertyDto: UpdatePropertyDto) {
    try {
      const { status } = updatePropertyDto;

      const property = await this.propertyRepository.findOne({ where: { id }, relations: ['address'] });
      property.status = status;

      if (!property) throw new Error('Propriedade não encontrada.');

      if (!Status[status]) throw new Error('Status inválido.');

      await this.propertyRepository.update(id, { status: Status[status] });


      return {
        success: true,
        property: property,
        message: 'Propriedade atualizada com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async addDetails(id: number, detailsDto: Detail[]) {
    try {
      const property = await this.propertyRepository.findOneBy({ id });
      const details: Detail[] = [];
      for (let i = 0; i < detailsDto.length; i++) {
        if (typeof (detailsDto[i]) === "object") {
          const detail = await this.detailsService.findOne(detailsDto[i].id).then(res => res.detail);
          details.push(detail);
        }
      }

      property.details = details;

      return await this.propertyRepository.save(property);
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async remove(id: number) {
    try {
      const property = await this.propertyRepository.findOneBy({ id });

      if (!property) throw new Error('Propriedade não encontrada.');

      await this.propertyRepository.delete(id);

      return {
        success: true,
        message: 'Propriedade removida com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async codeGenerator(length: number) {
    let code = '' + Math.floor(Math.random() * 9 + 1);

    for (let i = 0; i < length - 1; i++) {
      code = code + '' + Math.floor(Math.random() * 9 + 0);
    }
    const codeAlreadyExits = await this.propertyRepository.findOne({ where: { code: code } });
    return codeAlreadyExits ? this.codeGenerator(length) : code;
  }

  async uploadImage(id: number, path: string) {
    try {
      const property = await this.propertyRepository.findOne({ where: { id } });

      if (!property) throw new Error('Propriedade não encontrada.');

      property.images.push(path);

      await this.propertyRepository.update(id, property);

      return {
        success: true,
        images: property.images,
        message: 'Propriedade atualizada com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async orderImages(id: number, images: Array<string>) {
    try {
      const property = await this.propertyRepository.findOne({ where: { id } });

      if (!property) throw new Error('Propriedade não encontrada.');

      property.images = images;

      await this.propertyRepository.update(id, property);

      return {
        success: true,
        images: property.images,
        message: 'Propriedade atualizada com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async removeImage(id: number, path: string) {
    try {
      const property = await this.propertyRepository.findOne({ where: { id } });

      if (!property) throw new Error('Propriedade não encontrada.');

      if (!property.images.find(item => item === path)) throw new Error('Imagem não encontrada.');

      property.images = property.images.filter(item => item != path);
      unlink(path, (err) => { });

      await this.propertyRepository.save(property);

      return {
        success: true,
        message: 'Imagem removida com sucesso.',
        images: property.images.filter(item => item != path)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async updateStatus(id: number, status: Status) {
    try {
      const property = await this.propertyRepository.findOne({ where: { id } });

      if (!property) throw new Error('Propriedade não encontrada');

      await this.propertyRepository.update(id, { status });

      return {
        success: true,
        message: 'Status alterado com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async findDataByDashboard() {
    try {
      const query = this.propertyRepository.createQueryBuilder('property')
        .select("property.type")
        .addSelect("SUM(CASE WHEN property.adType = 'aluguel' THEN 1 ELSE 0 END)", "num_aluguel")
        .addSelect("SUM(CASE WHEN property.adType = 'venda' THEN 1 ELSE 0 END)", "num_venda")
        .groupBy("property.type");

      return await query.getRawMany();
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async countPropertiesByTypeAndMonth() {
    try {
      const query = this.propertyRepository.createQueryBuilder('property')
        .select('COUNT(*) as count')
        .addSelect('property.adType as adType')
        .addSelect("DATE_FORMAT(property.createdAt, '%Y-%m') as month")
        .groupBy('adType, month')
        .orderBy('month');

      return await query.getRawMany();
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
