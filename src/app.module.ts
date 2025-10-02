import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./config/database.config";
import { UsersModule } from "./users/users.module";
import { ExercisesModule } from "./exercises/exercises.module";
import { WorkoutsModule } from "./workouts/workouts.module";
import { GoalsModule } from "./goals/goals.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), UsersModule, ExercisesModule, WorkoutsModule, GoalsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
