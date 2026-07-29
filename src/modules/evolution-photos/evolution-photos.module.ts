import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvolutionPhoto } from './entities/evolution-photo.entity';
import { EvolutionPhotosController } from './evolution-photos.controller';
import { EvolutionPhotosService } from './evolution-photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([EvolutionPhoto])],
  controllers: [EvolutionPhotosController],
  providers: [EvolutionPhotosService],
  exports: [EvolutionPhotosService],
})
export class EvolutionPhotosModule {}
