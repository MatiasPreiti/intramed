import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movies } from './movies.entity';
import { CreateMovieDto } from './dto/createMovies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,
  ) {}

  async addMovie(createMovieDto: CreateMovieDto): Promise<Movies> {
    const existing = await this.moviesRepository.findOneBy({
      title: createMovieDto.title,
    });

    if (existing) {
      throw new ConflictException('A movie with this title already exists');
    }

    try {
      const movie = this.moviesRepository.create(createMovieDto);
      return await this.moviesRepository.save(movie);
    } catch (error) {
      console.error('Error saving movie:', error);
      throw new InternalServerErrorException('Error creating movie');
    }
  }

  async findAll(): Promise<Movies[]> {
    try {
      return await this.moviesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving movies');
    }
  }

  async findOne(id: number): Promise<Movies> {
    try {
      const movie = await this.moviesRepository.findOneBy({ id });
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving movie');
    }
  }

  async update(
    id: number,
    updateDto: Partial<CreateMovieDto>,
  ): Promise<Movies> {
    try {
      const movie = await this.findOne(id);
      if (!movie) {
        throw new NotFoundException();
      }
      Object.assign(movie, updateDto);
      return await this.moviesRepository.save(movie);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating movie');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.moviesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Movie not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting movie');
    }
  }
}
