import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Movies } from './movies.entity';
import { apiResponseWrapper } from '../../utils/factories/apiResponseWrapper.factory';
import { CreateMovieDto } from './dto/createMovies.dto';
import { JwtAuthGuard } from '../../utils/guard/jwtAuthGuard/jwtAuthGuard';
import { RolesGuard } from '../../utils/guard/roles/roles.guard';
import { Public } from '../../utils/guard/roles/public';
import { Roles } from '../../utils/guard/roles/decorator';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Get all movies',
    description: 'Retrieve a list of all movies',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Movies),
    isArray: true,
    description: 'List of movies',
  })
  @Public()
  @Get()
  async findAll(): Promise<Movies[]> {
    return this.moviesService.findAll();
  }

  @ApiOperation({
    summary: 'Get movie by ID',
    description: 'Retrieve details of a specific movie (user access only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Movies),
    description: 'Movie details',
  })
  @Roles('user')
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Movies> {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Only administrators can create new movies',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(Movies),
    description: 'Movie created successfully',
  })
  @Roles('admin')
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movies> {
    return this.moviesService.addMovie(createMovieDto);
  }

  @ApiOperation({
    summary: 'Update a movie',
    description: 'Only administrators can update movie information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Movies),
    description: 'Movie updated successfully',
  })
  @ApiBody({ type: CreateMovieDto, description: 'Fields to update (partial)' })
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: Partial<CreateMovieDto>,
  ): Promise<Movies> {
    return this.moviesService.update(id, updateDto);
  }

  @ApiOperation({
    summary: 'Delete a movie',
    description: 'Only administrators can delete a movie',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Movie deleted successfully',
  })
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(id);
  }
}
