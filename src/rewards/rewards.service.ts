import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rewards, RewardsDocument } from './rewards.schema';

@Injectable()
export class RewardsService {
    constructor(@InjectModel(Rewards.name) private RewardsModel: Model<RewardsDocument>) { }

    async create(statistic): Promise<Rewards> {
        const createdStatistic = new this.RewardsModel(statistic);
        return createdStatistic.save();
    }

    async findOne(query: object, projection = null, options = {}): Promise<Rewards> {
        return this.RewardsModel.findOne(query, projection, options).lean();
    }

    async find(query: object, projection = null, options = {}): Promise<Rewards[]> {
        return this.RewardsModel.find(query, projection, options).lean();
    }
}
