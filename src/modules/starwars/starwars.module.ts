import { Module } from '@nestjs/common';
import { StarwarsService } from './starwars.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [StarwarsService],
  controllers: [],
})
export class StarwarsModule {}
