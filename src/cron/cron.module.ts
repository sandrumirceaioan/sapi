import { forwardRef, Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { Cron } from "@nestjs/schedule";
import * as moment from 'moment';
import { StatisticsModule } from '../statistics/statistics.module';
import { SecretModule } from '../secret/secret.module';;

@Module({
  imports: [
    forwardRef(() => SecretModule),
    forwardRef(() => StatisticsModule),
  ],
  providers: [
    CronService
  ],
  exports: [CronService],
  controllers: [],
})

export class CronModule {
  private crons;
  constructor(
    private cronService: CronService,
  ) {
    this.crons = {};
  }

  @Cron('*/30 * * * * *')
  statisticsCron() {
    //console.log('getStatistics STARTED');
    //this.startCron(this.cronService, 'getStatistics');
  }


  async startCron(cron, name) {
    if (this.crons && this.crons[name] && this.crons[name].running) {
      return console.log(
        name + ' cron already running since %s',
        this.crons[name].started,
      );
    }
    this.crons[name] = {
      running: true,
      started: moment(),
    };

    try {
      await cron.getStatistics();
    } catch (e) {
      console.log(e)
    }
    this.crons[name].running = false;
  }

}



