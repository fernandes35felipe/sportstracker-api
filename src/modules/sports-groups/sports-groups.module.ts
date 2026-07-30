import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsGroup } from './entities/sports-group.entity';
import { SportsGroupMember } from './entities/sports-group-member.entity';
import { SportsGroupClass } from './entities/sports-group-class.entity';
import { SportsGroupSession } from './entities/sports-group-session.entity';
import { SportsGroupSessionFeedback } from './entities/sports-group-session-feedback.entity';
import { SportsGroupsController } from './sports-groups.controller';
import { SportsGroupsService } from './sports-groups.service';
import { PaymentAlertsService } from './payment-alerts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SportsGroup,
      SportsGroupMember,
      SportsGroupClass,
      SportsGroupSession,
      SportsGroupSessionFeedback,
    ]),
  ],
  controllers: [SportsGroupsController],
  providers: [SportsGroupsService, PaymentAlertsService],
  exports: [SportsGroupsService],
})
export class SportsGroupsModule {}
