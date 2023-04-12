import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerTypeDto } from './dto/create-banner-type.dto';
import { UpdateBannerTypeDto } from './dto/update-banner-type.dto';
import { BannerType } from './entities/banner-type.entity';

@Injectable()
export class BannerTypesService {
  constructor(
    @InjectRepository(BannerType) private bannerTypeRepository: Repository<BannerType>
  ) { }

  async create(createBannerTypeDto: CreateBannerTypeDto) {
    try {
      const bannerType = this.bannerTypeRepository.create(createBannerTypeDto);

      return {
        success: true,
        bannerType: await this.bannerTypeRepository.save(bannerType)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll() {
    return await this.bannerTypeRepository.find();
  }

  async findOne(id: number) {
    try {
      const bannerTypeAlreadyExists = await this.bannerTypeRepository.findOne({
        where: {
          id
        }
      });

      if (!bannerTypeAlreadyExists) throw new Error('Tipo de baner não encontrado.');

      return bannerTypeAlreadyExists;
    } catch (error) {
      return {
        success: true,
        message: error.message
      }
    }
  }

  async update(id: number, updateBannerTypeDto: UpdateBannerTypeDto) {
    try {
      const bannerTypeAlreadyExists = await this.bannerTypeRepository.findOne({ where: { id } });

      if (!bannerTypeAlreadyExists) throw new Error('Tipo de baner não encontrado.');

      await this.bannerTypeRepository.update(id, updateBannerTypeDto);

      return {
        success: true,
        bannerType: await this.bannerTypeRepository.findOne({ where: { id } })
      };
    } catch (error) {
      return {
        success: true,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const bannerTypeAlreadyExists = await this.bannerTypeRepository.findOne({ where: { id } });

      if (!bannerTypeAlreadyExists) throw new Error('Tipo de baner não encontrado.');

      await this.bannerTypeRepository.delete(id);

      return {
        success: true,
        message: 'Tipo de baner deletado com sucesso.'
      };
    } catch (error) {
      return {
        success: true,
        message: error.message
      }
    }
  }
}
