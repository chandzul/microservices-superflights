import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { ReadFlightDto } from './dto/read-flight.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import axios from 'axios';
import * as moment from 'moment';
import { LocationInterface } from '../common/interfaces/location.interface';
import { WeatherInterface } from '../common/interfaces/weather.interface';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
  ) {}

  async getLocation(destinationCity: string): Promise<LocationInterface> {
    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/search/?query=${destinationCity}`,
    );
    return data[0];
  }

  async getWeather(woeId: number, flightDate: Date): Promise<any> {
    // ): Promise<WeatherInterface[]> {
    const dateFormat = moment.utc(flightDate).format();
    console.log(dateFormat);
    const year = dateFormat.substring(0, 4);
    const month = dateFormat.substring(5, 7);
    const day = dateFormat.substring(8, 10);
    console.log(year, month, day);

    const { data } = await axios.get(
      `https://www.metaweather.com/api/location/${woeId}/${year}/${month}/${day}`,
    );

    return data;
  }

  async assign(
    {
      id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
    }: ReadFlightDto,
    weather: WeatherInterface[],
  ): Promise<ReadFlightDto> {
    return Object.assign({
      id,
      pilot,
      airplane,
      destinationCity,
      flightDate,
      passengers,
      weather,
    });
  }

  async create(createFlightDto: CreateFlightDto): Promise<CreateFlightDto> {
    const createdFlight = await this.flightRepository.save({
      ...createFlightDto,
    });
    return createdFlight;
  }

  async findAll(): Promise<ReadFlightDto[]> {
    return await this.flightRepository.find();
  }

  async findOne(id: number): Promise<ReadFlightDto> {
    const flight = await this.flightRepository.findOneOrFail(id);
    console.log(flight);
    const location: LocationInterface = await this.getLocation(
      flight.destinationCity,
    );
    console.log(location);

    const weather: WeatherInterface[] = await this.getWeather(
      location.woeid,
      flight.flightDate,
    );

    return this.assign(flight, weather);
  }

  async update(
    id: number,
    updateFlightDto: UpdateFlightDto,
  ): Promise<UpdateFlightDto> {
    const flight = await this.flightRepository.preload({
      id: +id,
      ...updateFlightDto,
    });

    if (!flight) {
      throw new NotFoundException(`Flight #[${id}] not found`);
    }

    return this.flightRepository.save(flight);
  }

  async delete(id: number) {
    const flight = await this.flightRepository.findOneOrFail(id);
    return await this.flightRepository.remove(flight);
  }

  async addPassenger(
    flightId: number,
    passengerId: number,
  ): Promise<ReadFlightDto> {
    return await this.flightRepository.preload({
      id: +flightId,
    });
  }
}
