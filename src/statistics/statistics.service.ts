import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Statistic, StatisticsDocument } from './statistics.schema';

@Injectable()
export class StatisticsService {
    constructor(@InjectModel(Statistic.name) private StatisticsModel: Model<StatisticsDocument>) { }

    async create(statistic): Promise<Statistic> {
        const createdStatistic = new this.StatisticsModel(statistic);
        return createdStatistic.save();
    }

    async findOne(query: object): Promise<Statistic> {
        return this.StatisticsModel.findOne(query).exec();
    }

    async findAll(): Promise<Statistic[]> {
        return this.StatisticsModel.find().exec();
    }

    async latest(): Promise<Statistic> {
        return (await this.StatisticsModel.find({}).sort({ date: -1 }).limit(1).exec())[0];

    }
}
