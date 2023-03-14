import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { PropertyType } from './entities/property-type.entity';

@Injectable()
export class PropertyTypesService {
  constructor(
    @InjectRepository(PropertyType) private propertyTypeRepository: Repository<PropertyType>
  ) { }

  async create(createPropertyTypeDto: CreatePropertyTypeDto) {
    try {
      const { name } = createPropertyTypeDto;
      const slug = slugify(name, { lower: true });
      const propertyType = this.propertyTypeRepository.create({ ...createPropertyTypeDto, slug });

      return {
        success: true,
        propertyType: await this.propertyTypeRepository.save(propertyType)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll() {
    return await this.propertyTypeRepository.find();
  }

  async findOne(id: number) {
    try {
      const propertyType = await this.propertyTypeRepository.findOneBy({ id });

      if (!propertyType) throw new Error('Tipo de propriedade não existe.');

      return {
        success: true,
        propertyType
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: number, updatePropertyTypeDto: UpdatePropertyTypeDto) {
    try {
      const { name } = updatePropertyTypeDto;
      const slug = slugify(name, { lower: true });

      const propertyType = await this.propertyTypeRepository.findOneBy({ id });

      if (!propertyType) throw new Error('Tipo de propriedade não existe.');

      await this.propertyTypeRepository.update(id, {...updatePropertyTypeDto, slug});

      return {
        success: true,
        propertyType: await this.propertyTypeRepository.findOneBy({ id }),
        message: 'Tipo de propriedade atualizado com sucesso.'
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
      const propertyType = await this.propertyTypeRepository.findOneBy({ id });

      if (!propertyType) throw new Error('Tipo de propriedade não existe.');

      await this.propertyTypeRepository.delete(id);

      return {
        success: true,
        message: 'Tipo de propriedade removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
