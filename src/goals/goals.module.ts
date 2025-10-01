import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Goal } from "./entities/goal.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class GoalsModule {}
