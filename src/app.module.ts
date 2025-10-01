import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./config/database.config";
import { UsersModule } from "./users/users.module";
import { ExercisesModule } from "./exercises/exercises.module";
import { WorkoutsModule } from "./workouts/workouts.module";
import { GoalsModule } from "./goals/goals.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    ExercisesModule,
    WorkoutsModule,
    GoalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
