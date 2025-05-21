import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/user/users.module';
import { Users } from './modules/user/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import createDatabaseIfNotExists from './utils/database-utils/dbscript';
import { StarwarsModule } from './modules/starwars/starwars.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        await createDatabaseIfNotExists(configService);
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [Users],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    MoviesModule,
    StarwarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
