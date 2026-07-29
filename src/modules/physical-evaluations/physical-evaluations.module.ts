import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhysicalEvaluation } from './entities/physical-evaluation.entity';
import { PhysicalEvaluationsController } from './physical-evaluations.controller';
import { PhysicalEvaluationsService } from './physical-evaluations.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhysicalEvaluation])],
  controllers: [PhysicalEvaluationsController],
  providers: [PhysicalEvaluationsService],
  exports: [PhysicalEvaluationsService],
})
export class PhysicalEvaluationsModule {}
