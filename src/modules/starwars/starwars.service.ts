import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { MoviesService } from '../movies/movies.service';
import { CreateMovieDto } from '../movies/dto/createMovies.dto';

@Injectable()
export class StarwarsService implements OnModuleInit {
  private readonly apiUrl = process.env.STARWARS_API;
  private readonly logger = new Logger(StarwarsService.name);

  constructor(private readonly moviesService: MoviesService) {}

  async onModuleInit() {
    await this.fetchFilms();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.fetchFilms();
  }

  private async fetchFilms() {
    try {
      const response = await axios.get(`${this.apiUrl}/films`);
      const films = response.data?.result;

      if (!films || !Array.isArray(films)) {
        this.logger.warn('No films found in response');
        return;
      }

      this.logger.log(`Fetched ${films.length} Star Wars films`);

      for (const film of films) {
        const props = film.properties;
        if (!props.title) {
          this.logger.error(`Error inserting untitled movie`);
        }
        const movieDto: CreateMovieDto = {
          title: props.title,
          director: props.director ?? null,
          release_date: props.release_date ?? null,
          description: film.description ?? null,
          properties: { ...(props.propiertes ?? null) },
        };

        try {
          await this.moviesService.addMovie(movieDto);
          this.logger.log(`Inserted movie: ${props.title}`);
        } catch (error) {
          if (error?.status === 409) {
            this.logger.warn(`Movie already exists: ${props.title}`);
          } else {
            this.logger.error(
              `Error inserting movie ${props.title}: ${error.message}`,
            );
          }
        }
        continue;
      }
    } catch (error) {
      this.logger.error('Error fetching Star Wars films:', error.message);
    }
  }
}
