import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { FindAddressDto } from './dto/find-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

interface ITag {
  name: string;
  count: number;
}

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(Property) private propertyRepository: Repository<Property>,
  ) { }

  async create(createAddressDto: Address) {
    const address = this.addressRepository.create(createAddressDto);
    return await this.addressRepository.save(address);
  }

  async findAll() {
    return await this.addressRepository.find();
  }

  async findCities() {
    const array = [];
    const query = this.addressRepository.createQueryBuilder('address').groupBy("address.city").select('address.city');
    const cities = await query.getMany();
    cities.forEach(city => array.push({ name: city.city }));
    return array;
  }

  async findDistrictsByCity(city: string) {
    const array = [];
    const query = this.addressRepository
      .createQueryBuilder('address')
      .andWhere('address.city LIKE :city', { city: `%${city}%` })
      .groupBy("address.district")
      .select('address.district');
    const districts = await query.getMany();
    districts.forEach(district => array.push({ name: district.district }));
    return array;
  }

  async findTags(queryDto: FindAddressDto) {
    try {
      const { city, realEstateId } = queryDto;


      let tags: ITag[] = []
      const districts = await this.findDistrictsByCity(city);

      for (let i = 0; i < districts.length; i++) {
        const query = this.propertyRepository.createQueryBuilder('property')
          .leftJoin('property.address', 'address')

        { realEstateId && query.leftJoin('property.realEstate', 'realEstate') }

        query.where('address.district = :district', { district: districts[i].name });
        { realEstateId && query.andWhere('realEstate.id = :realEstateId', {realEstateId}) }

        const count = await query.getCount();

        {
          count > 0 && tags.push({
            count,
            name: districts[i].name
          })
        }
      }

      return {
        success: true,
        results: tags.sort((a, b) => {
          if (a.count > b.count) {
            return -1;
          }
          if (a.count < b.count) {
            return 1;
          }
          // a must be equal to b
          return 0;
        })
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  async findByPlaceId(place_id: string) {
    return await this.addressRepository.findOne({
      where: { place_id }
    })
  }

  async findByZipcode(zipcode: string) {
    return await this.addressRepository.findOne({
      where: { zipcode }
    })
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
