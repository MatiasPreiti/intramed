import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
}
