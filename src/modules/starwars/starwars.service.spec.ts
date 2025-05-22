import { Test, TestingModule } from '@nestjs/testing';
import { StarwarsService } from './starwars.service';
import { MoviesService } from '../movies/movies.service';
import axios from 'axios';
import { Logger } from '@nestjs/common';

const mockMoviesService = {
  addMovie: jest.fn(),
};

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('StarwarsService', () => {
  let service: StarwarsService;
  let moviesService: MoviesService;
  let axiosGetSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarwarsService,
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<StarwarsService>(StarwarsService);
    moviesService = module.get<MoviesService>(MoviesService);

    jest.clearAllMocks();

    axiosGetSpy = jest.spyOn(axios, 'get');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchFilms', () => {
    const mockFilmsData = {
      result: [
        {
          properties: {
            title: 'A New Hope',
            director: 'George Lucas',
            release_date: '1977-05-25',
          },
          description: 'Film description 1',
        },
        {
          properties: {
            title: 'The Empire Strikes Back',
            director: 'Irvin Kershner',
            release_date: '1980-05-21',
          },
          description: 'Film description 2',
        },
      ],
    };

    it('should fetch films and add them to the database', async () => {
      axiosGetSpy.mockResolvedValue({ data: mockFilmsData });

      (mockMoviesService.addMovie as jest.Mock).mockResolvedValue({});

      await (service as any).fetchFilms();

      expect(axiosGetSpy).toHaveBeenCalledWith(
        expect.stringContaining('/films'),
      );
      expect(mockMoviesService.addMovie).toHaveBeenCalledTimes(
        mockFilmsData.result.length,
      );
      expect(mockMoviesService.addMovie).toHaveBeenCalledWith({
        title: 'A New Hope',
        director: 'George Lucas',
        release_date: '1977-05-25',
        description: 'Film description 1',
        properties: mockFilmsData.result[0].properties,
      });
      expect(mockMoviesService.addMovie).toHaveBeenCalledWith({
        title: 'The Empire Strikes Back',
        director: 'Irvin Kershner',
        release_date: '1980-05-21',
        description: 'Film description 2',
        properties: mockFilmsData.result[1].properties,
      });
    });

    it('should handle empty films array from API response', async () => {
      axiosGetSpy.mockResolvedValue({ data: { result: [] } });

      await (service as any).fetchFilms();

      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(mockMoviesService.addMovie).not.toHaveBeenCalled();
    });

    it('should handle missing result array from API response', async () => {
      axiosGetSpy.mockResolvedValue({ data: {} });

      await (service as any).fetchFilms();

      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(mockMoviesService.addMovie).not.toHaveBeenCalled();
    });

    it('should handle API fetch error', async () => {
      axiosGetSpy.mockRejectedValue(new Error('Network error'));

      await (service as any).fetchFilms();

      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(mockMoviesService.addMovie).not.toHaveBeenCalled();
    });

    it('should handle movie already exists error (status 409)', async () => {
      axiosGetSpy.mockResolvedValue({ data: mockFilmsData });
      (mockMoviesService.addMovie as jest.Mock)
        .mockRejectedValueOnce({ status: 409, message: 'Conflict' })
        .mockResolvedValueOnce({});
      await (service as any).fetchFilms();

      expect(mockMoviesService.addMovie).toHaveBeenCalledTimes(
        mockFilmsData.result.length,
      );
    });

    it('should handle other insertion errors', async () => {
      axiosGetSpy.mockResolvedValue({ data: mockFilmsData });
      (mockMoviesService.addMovie as jest.Mock).mockRejectedValue(
        new Error('Database connection lost'),
      );

      await (service as any).fetchFilms();

      expect(mockMoviesService.addMovie).toHaveBeenCalledTimes(
        mockFilmsData.result.length,
      );
    });

    it('should handle films with missing titles', async () => {
      const filmsWithMissingTitle = {
        result: [
          { properties: { title: 'Valid Film' } },
          { properties: { director: 'No Title Here' } },
        ],
      };
      axiosGetSpy.mockResolvedValue({ data: filmsWithMissingTitle });
      (mockMoviesService.addMovie as jest.Mock).mockResolvedValue({});

      await (service as any).fetchFilms();

      expect(mockMoviesService.addMovie).toHaveBeenCalledTimes(2);
      expect(mockMoviesService.addMovie).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Valid Film' }),
      );
    });
  });

  describe('onModuleInit', () => {
    it('should call fetchFilms on module initialization', async () => {
      const fetchFilmsSpy = jest
        .spyOn(service as any, 'fetchFilms')
        .mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(fetchFilmsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCron', () => {
    it('should call fetchFilms when cron job runs', async () => {
      const fetchFilmsSpy = jest
        .spyOn(service as any, 'fetchFilms')
        .mockResolvedValue(undefined);

      await service.handleCron();

      expect(fetchFilmsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
