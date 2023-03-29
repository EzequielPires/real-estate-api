import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { CreateAddressDto, CreateCityDto, CreateDistrictDto, CreateStateDto } from './dto/create-address.dto';
import { FindAddressDto } from './dto/find-address.dto';
import { UpdateAddressDto, UpdateCityDto, UpdateDistrictDto, UpdateStateDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { State } from './entities/state.entity';

interface ITag {
  name: string;
  count: number;
}

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(Property) private propertyRepository: Repository<Property>,
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(State) private stateRepository: Repository<State>,
    @InjectRepository(District) private districtRepository: Repository<District>,
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

  /* async findDistrictsByCity(city: string) {
    const array = [];
    const query = this.addressRepository
      .createQueryBuilder('address')
      .andWhere('address.city LIKE :city', { city: `%${city}%` })
      .groupBy("address.district")
      .select('address.district');
    const districts = await query.getMany();
    districts.forEach(district => array.push({ name: district.district }));
    return array;
  } */

  async findTags(queryDto: FindAddressDto) {
    try {
      const { city, realEstateId } = queryDto;


      let tags: ITag[] = []
      const {results: districts} = await this.findDistrictsByCity(+city);

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

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    await this.addressRepository.update(id, updateAddressDto);
    return await this.addressRepository.findOne({where: {id}});
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }

  //new fetuares

  //states
  async createState(createStateDto: CreateStateDto) {
    try {
      const state = this.stateRepository.create(createStateDto);
      return {
        success: true,
        state: await this.stateRepository.save(state)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findStates() {
    try {
      return {
        success: true,
        results: await this.stateRepository.find()
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async updateState(id: number, updateStateDto: UpdateStateDto) {

  }

  async removeState(id: number) {

  }

  //cities
  async createCity(createCityDto: CreateCityDto) {
    const { state, apiId } = createCityDto;
    try {
      if (!state) throw new Error('É necessário um estado para cadastar uma cidade.');

      const cityAlreadyExists = await this.cityRepository.findOne({
        where: {
          apiId,
          state: {
            id: state.id
          }
        }
      });
      if (cityAlreadyExists) throw new Error('Cidade já foi cadastrada.');

      const city = this.cityRepository.create(createCityDto);
      return {
        success: true,
        city: await this.cityRepository.save(city)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findCitiesByState(stateId: number) {
    try {
      const results = await this.cityRepository.find({where: {state: {id: stateId}}, order: {name: 'ASC'}});

      return {
        success: true,
        results
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async updateCity(id: number, updateCityDto: UpdateCityDto) {

  }

  async removeCity(id: number) {

  }

  //districts
  async createDistrict(createDistrictDto: CreateDistrictDto) {
    const { city, name } = createDistrictDto;
    try {
      if (!city) throw new Error('É necessário uma cidade para cadastar um bairro.');

      const districtAlreadyExists = await this.districtRepository.findOne({
        where: {
          name: Like(name),
          city: {
            id: city.id
          }
        }
      });
      if (districtAlreadyExists) throw new Error('Bairro já foi cadastrada.');

      const district = this.districtRepository.create(createDistrictDto);

      return {
        success: true,
        district: await this.districtRepository.save(district)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findDistricts() {
    return await this.districtRepository.find({relations: ['city']});
  }

  async findDistrictsByCity(cityId: number) {
    try {
      const results = await this.districtRepository.find({where: {city: {id: cityId}}, order: {name: 'ASC'}});

      return {
        success: true,
        results,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async updateDistrict(id: number, updateDistrictDto: UpdateDistrictDto) {

  }

  async removeDistrict(id: number) {

  }
}
