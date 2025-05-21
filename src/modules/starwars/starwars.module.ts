import { Module } from '@nestjs/common';
import { StarwarsService } from './starwars.service';

@Module({
  providers: [StarwarsService],
  controllers: [],
})
export class StarwarsModule {}
