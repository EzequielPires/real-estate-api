import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DetailType } from 'src/enums/property.enum';
import { Repository } from 'typeorm';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { Detail } from './entities/detail.entity';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail) private detailRepository: Repository<Detail>
  ) { }

  async create(createDetailDto: CreateDetailDto) {
    try {
      const detailAlreadyExists = await this.detailRepository.findOne({ where: { name: createDetailDto.name } });

      if (detailAlreadyExists) throw new Error('Detalhe já foi cadastrado.');

      if (!DetailType[createDetailDto.type]) throw new Error('É necessario um tipo.');

      const slug = slugify(createDetailDto.name, { lower: true });

      const detail = this.detailRepository.create({ ...createDetailDto, slug });

      return {
        success: true,
        detail: await this.detailRepository.save(detail)
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
      const characteristics = await this.detailRepository.find({where: {type: DetailType.characteristics}});
      const furniture = await this.detailRepository.find({where: {type: DetailType.furniture}});
      const security = await this.detailRepository.find({where: {type: DetailType.security}});
      const extras = await this.detailRepository.find({where: {type: DetailType.extras}});

      return {
        success: true,
        results: {
          characteristics,
          furniture,
          security,
          extras
        }
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
      const detail = await this.detailRepository.findOne({ where: { id } });

      if (!detail) throw new Error('Detalhe não foi encontrado.');

      return {
        success: true,
        detail
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: number, updateDetailDto: UpdateDetailDto) {
    try {
      const detail = await this.detailRepository.findOne({ where: { id } });

      if (!detail) throw new Error('Detalhe não foi encontrado.');

      await this.detailRepository.update(id, updateDetailDto);

      return {
        success: true,
        detail,
        message: 'Detalhe atualizado com sucesso.'
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
      const detail = await this.detailRepository.findOne({ where: { id } });

      if (!detail) throw new Error('Detalhe não foi encontrado.');

      await this.detailRepository.delete(id);

      return {
        success: true,
        message: 'Detalhe removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
