import { ApiPropertyOptional } from '@nestjs/swagger';

export class StarWarsFilmPropertiesDto {
  @ApiPropertyOptional()
  created?: string;

  @ApiPropertyOptional()
  edited?: string;

  @ApiPropertyOptional({ type: [String] })
  starships?: string[];

  @ApiPropertyOptional({ type: [String] })
  vehicles?: string[];

  @ApiPropertyOptional({ type: [String] })
  planets?: string[];

  @ApiPropertyOptional()
  producer?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  episode_id?: number;

  @ApiPropertyOptional()
  director?: string;

  @ApiPropertyOptional()
  release_date?: string;

  @ApiPropertyOptional()
  opening_crawl?: string;

  @ApiPropertyOptional({ type: [String] })
  characters?: string[];

  @ApiPropertyOptional({ type: [String] })
  species?: string[];

  @ApiPropertyOptional()
  url?: string;
}

export class StarWarsFilmDto {
  @ApiPropertyOptional()
  _id?: string;

  @ApiPropertyOptional()
  uid?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  __v?: number;

  @ApiPropertyOptional({ type: StarWarsFilmPropertiesDto })
  properties?: StarWarsFilmPropertiesDto;
}

export class StarWarsResponseDto {
  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional({ type: [StarWarsFilmDto] })
  result?: StarWarsFilmDto[];
}
