import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // type: 'mysql',
        // host: configService.getOrThrow('MYSQL_HOST'),
        // port: configService.getOrThrow('MYSQL_PORT'),
        // database: configService.getOrThrow('MYSQL_DATABASE'),
        // username: configService.getOrThrow('MYSQL_USERNAME'),
        // password: configService.getOrThrow('MYSQL_PASSWORD'),
        // autoLoadEntities: true,
        // synchronize: true,
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow('POSTGRES_PORT'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        username: configService.getOrThrow('POSTGRES_USER'),
        entities: [User],
        database: configService.getOrThrow('POSTGRES_DATABASE'),
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
