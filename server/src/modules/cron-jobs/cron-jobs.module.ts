import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';
import { CronJobsService } from './cron-jobs.service';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [CronJobsService],
  exports: [CronJobsService],
})
export class CronJobsModule {}
