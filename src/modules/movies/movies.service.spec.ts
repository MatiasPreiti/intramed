import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movies } from './movies.entity';
import { CreateMovieDto } from './dto/createMovies.dto';
import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockMoviesRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movies>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movies),
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movies>>(getRepositoryToken(Movies));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMovie', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'New Movie',
      director: 'Director 1',
      release_date: '2024-01-01',
      description: 'Desc 1',
      properties: {},
    };
    const savedMovie: Movies = { id: 1, ...createMovieDto };

    it('should successfully add a new movie', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockReturnValue(createMovieDto);
      (repository.save as jest.Mock).mockResolvedValue(savedMovie);

      const result = await service.addMovie(createMovieDto);
      expect(result).toEqual(savedMovie);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        title: createMovieDto.title,
      });
      expect(repository.create).toHaveBeenCalledWith(createMovieDto);
      expect(repository.save).toHaveBeenCalledWith(createMovieDto);
    });

    it('should throw ConflictException if a movie with the same title already exists', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(savedMovie);

      await expect(service.addMovie(createMovieDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        title: createMovieDto.title,
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error during save', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockReturnValue(createMovieDto);
      (repository.save as jest.Mock).mockRejectedValue(
        new Error('Database connection error'),
      );

      await expect(service.addMovie(createMovieDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        title: createMovieDto.title,
      });
      expect(repository.create).toHaveBeenCalledWith(createMovieDto);
      expect(repository.save).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('findAll', () => {
    const moviesList: Movies[] = [
      {
        id: 1,
        title: 'Movie 1',
        director: 'D1',
        release_date: '2023',
        description: 'Desc1',
        properties: {},
      },
      {
        id: 2,
        title: 'Movie 2',
        director: 'D2',
        release_date: '2024',
        description: 'Desc2',
        properties: {},
      },
    ];

    it('should return an array of movies', async () => {
      (repository.find as jest.Mock).mockResolvedValue(moviesList);

      const result = await service.findAll();
      expect(result).toEqual(moviesList);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException on database error during find all', async () => {
      (repository.find as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const existingMovie: Movies = {
      id: 1,
      title: 'Existing Movie',
      director: 'Director A',
      release_date: '2020',
      description: 'Desc A',
      properties: {},
    };

    it('should return a movie if found by ID', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(existingMovie);

      const result = await service.findOne(1);
      expect(result).toEqual(existingMovie);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if movie not found by ID', async () => {
      (repository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should throw InternalServerErrorException on database error during find one', async () => {
      (repository.findOneBy as jest.Mock).mockRejectedValue(
        new Error('Query failed'),
      );

      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    const existingMovie: Movies = {
      id: 1,
      title: 'Original Title',
      director: 'Original Director',
      release_date: '2020',
      description: 'Original Desc',
      properties: {},
    };
    const updateDto: Partial<CreateMovieDto> = { title: 'Updated Title' };
    const updatedMovie: Movies = { ...existingMovie, ...updateDto };

    it('should successfully update an existing movie', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(existingMovie as any);

      (repository.save as jest.Mock).mockResolvedValue(updatedMovie);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedMovie);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: 'Updated Title',
        }),
      );
    });

    it('should throw NotFoundException if movie to update is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(999);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error during save', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(existingMovie as any);
      (repository.save as jest.Mock).mockRejectedValue(
        new Error('Database write error'),
      );

      await expect(service.update(1, updateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a movie', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if movie to remove is not found', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });

    it('should throw InternalServerErrorException on database error during delete', async () => {
      (repository.delete as jest.Mock).mockRejectedValue(
        new Error('Database connection lost'),
      );

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
