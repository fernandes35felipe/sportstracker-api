import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workout } from "./entities/workout.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Workout])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class WorkoutsModule {}
