import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IsUniqueConstraint } from './decorators/classes/isUniqueConstraint';
import { IsUniqueUserConstraint } from './decorators/classes/isUniqueUserConstraint';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true , cache: true}),
    DatabaseModule,
    AuthModule,UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, IsUniqueUserConstraint],
})
export class AppModule {}
