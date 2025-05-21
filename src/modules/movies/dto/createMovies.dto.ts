// src/movies/dto/create-movie.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  release_date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  properties?: Record<string, string>;
}
