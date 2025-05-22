import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'New movie' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'George Lucas' })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({ example: '2030-05-25' })
  @IsOptional()
  @IsString()
  release_date?: string;

  @ApiPropertyOptional({ example: 'A Star Wars Film' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Optional JSON object with additional properties',
    example: {
      episode_id: '4',
      producer: 'Gary Kurtz, Rick McCallum',
      opening_crawl: 'It is a period of civil war...',
    },
  })
  @IsOptional()
  @IsObject()
  properties?: Record<string, string>;
}
