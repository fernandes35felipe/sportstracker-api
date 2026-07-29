import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerAthleteRelation } from './entities/trainer-athlete-relation.entity';
import { TrainerAthletesController } from './trainer-athletes.controller';
import { TrainerAthletesService } from './trainer-athletes.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerAthleteRelation]), UsersModule],
  controllers: [TrainerAthletesController],
  providers: [TrainerAthletesService],
  exports: [TrainerAthletesService],
})
export class TrainerAthletesModule {}
