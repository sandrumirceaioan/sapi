import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticSchema } from './statistics.schema';
import { StatisticsService } from './statistics.service';
import { Statistic } from './statistics.schema';
import { SecretModule } from '../secret/secret.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }]),
        SecretModule
      ],
    controllers: [StatisticsController],
    providers: [StatisticsService],
    exports: [StatisticsService]
})
export class StatisticsModule { }
