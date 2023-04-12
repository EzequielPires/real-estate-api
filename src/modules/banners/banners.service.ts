import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { FindBannersDto } from './dto/find-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';
import { compressImage } from 'src/helpers/compress';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private bannerRepository: Repository<Banner>,
  ) { }

  async create(createBannerDto: CreateBannerDto) {
    try {
      const banner = this.bannerRepository.create(createBannerDto);

      return {
        success: true,
        banner: await this.bannerRepository.save(banner)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDto: FindBannersDto) {
    try {
      const { bannerTypeId, limit, page } = queryDto;
      const query = this.bannerRepository.createQueryBuilder('banner')
        .leftJoinAndSelect('banner.bannerType', 'bannerType')
        .skip(page ? (limit ?? 15) * (page - 1) : 0)
        .take(limit ?? 15)
        .orderBy("banner.createdAt", 'DESC');

      { bannerTypeId ? query.where('bannerType.id = :bannerTypeId', { bannerTypeId }) : null }

      const [results, total] = await query.getManyAndCount();
      return {
        success: true,
        results,
        total,
        page: queryDto.page ? Number(queryDto.page) : 1,
        limit: queryDto.limit ? Number(queryDto.limit) : 15
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: number) {
    try {
      const bannerAlreadyExists = await this.bannerRepository.findOne({ where: { id } });

      if (!bannerAlreadyExists) throw new Error('Baner não encontrado.');

      return {
        success: true,
        banner: bannerAlreadyExists
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    try {
      const bannerAlreadyExists = await this.bannerRepository.findOne({ where: { id } });

      if (!bannerAlreadyExists) throw new Error('Baner não encontrado.');

      await this.bannerRepository.update(id, updateBannerDto);

      return {
        success: true,
        banner: await this.bannerRepository.findOne({ where: { id } })
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const bannerAlreadyExists = await this.bannerRepository.findOne({ where: { id } });

      if (!bannerAlreadyExists) throw new Error('Baner não encontrado.');

      await this.bannerRepository.delete(id);

      return {
        success: true,
        message: 'Baner deletado com sucesso.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async uploadImage(id: number, file: Express.Multer.File) {
    try {
      const bannerAlreadyExists = await this.bannerRepository.findOne({ where: { id } });
      if (!bannerAlreadyExists) throw new Error('Propriedade não encontrada.');

      const path = await compressImage(file);
      if (!path) throw new Error('Erro ao realizar upload.');

      bannerAlreadyExists.path = path;
      const res = await this.bannerRepository.save(bannerAlreadyExists);
      if (!res) throw new Error('Erro ao realizar upload.');

      return {
        success: true,
        message: 'Upload realizado com sucesso.',
        path: path,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
