import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsGroup } from './entities/sports-group.entity';
import { SportsGroupMember } from './entities/sports-group-member.entity';
import { SportsGroupClass } from './entities/sports-group-class.entity';
import { SportsGroupSession } from './entities/sports-group-session.entity';
import { SportsGroupsController } from './sports-groups.controller';
import { SportsGroupsService } from './sports-groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SportsGroup,
      SportsGroupMember,
      SportsGroupClass,
      SportsGroupSession,
    ]),
  ],
  controllers: [SportsGroupsController],
  providers: [SportsGroupsService],
  exports: [SportsGroupsService],
})
export class SportsGroupsModule {}
