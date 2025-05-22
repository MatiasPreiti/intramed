import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movies } from './movies.entity';
import { CreateMovieDto } from './dto/createMovies.dto';

const mockMoviesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  addMovie: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result: Movies[] = [
        {
          id: 1,
          title: 'Test Movie',
          director: 'Test Director',
          release_date: '2023-01-01',
          description: 'desc',
          properties: {},
        },
      ];
      mockMoviesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockMoviesService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const result: Movies = {
        id: 1,
        title: 'Test Movie',
        director: 'Test Director',
        release_date: '2023-01-01',
        description: 'desc',
        properties: {},
      };
      mockMoviesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return undefined if movie not found', async () => {
      mockMoviesService.findOne.mockResolvedValue(undefined);

      expect(await controller.findOne(999)).toBeUndefined();
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        director: 'New Director',
      };
      const createdMovie: Movies = {
        id: 2,
        ...createMovieDto,
        release_date: 'unknown',
        description: 'unknown',
        properties: {},
      };
      mockMoviesService.addMovie.mockResolvedValue(createdMovie);

      expect(await controller.create(createMovieDto)).toBe(createdMovie);
      expect(mockMoviesService.addMovie).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const updateMovieDto = { title: 'Updated Title' };
      const updatedMovie: Movies = {
        id: 1,
        title: 'Updated Title',
        director: 'Test Director',
        release_date: '2023-01-01',
        description: 'desc',
        properties: {},
      };
      mockMoviesService.update.mockResolvedValue(updatedMovie);

      expect(await controller.update(1, updateMovieDto)).toBe(updatedMovie);
      expect(mockMoviesService.update).toHaveBeenCalledWith(1, updateMovieDto);
    });

    it('should return undefined if movie to update not found', async () => {
      mockMoviesService.update.mockResolvedValue(undefined);

      expect(
        await controller.update(999, { title: 'Non Existent' }),
      ).toBeUndefined();
      expect(mockMoviesService.update).toHaveBeenCalledWith(999, {
        title: 'Non Existent',
      });
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(mockMoviesService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle movie not found when removing', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(999)).resolves.toBeUndefined();
      expect(mockMoviesService.remove).toHaveBeenCalledWith(999);
    });
  });
});
