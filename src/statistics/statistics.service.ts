import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Statistic, StatisticsDocument } from './statistics.schema';
import { SecretService } from '../secret/secret.service';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectModel(Statistic.name) private StatisticsModel: Model<StatisticsDocument>,
        private secretService: SecretService
        ) { }

    async create(statistic): Promise<Statistic> {
        const createdStatistic = new this.StatisticsModel(statistic);
        return createdStatistic.save();
    }

    async findOne(query: object, projection = null, options = {}): Promise<Statistic> {
        return this.StatisticsModel.findOne(query, projection, options).lean();
    }

    async find(query: object, projection = null, options = {}): Promise<Statistic[]> {
        return this.StatisticsModel.find(query, projection, options).lean();
    }

    async latest(): Promise<Statistic> {
        return (await this.StatisticsModel.find({}).sort({ date: -1 }).limit(1).exec())[0];

    }

    async getLatest() {
        const height = await this.secretService.getHeight();

        const sienna_price = await this.secretService.getPrice('sienna');
        const scrt_price = await this.secretService.getPrice('secret');
        
        const sienna_balance = await this.secretService.getBalance('SIENNA');
        const sienna_staked_balance = await this.secretService.getBalance('SIENNA_REWARDS');
        const scrt_balance = await this.secretService.getSCRTBalance();

        const sienna_rewards: any = await this.secretService.getRewardsData();
    
        let newData = await this.create({
            balances: {
                sienna: {
                    balance: sienna_balance,
                    staked: sienna_staked_balance,
                    next_claim: sienna_rewards.claimable,
                    total_rewards: sienna_rewards.user_earned
                },
                scrt: scrt_balance
            },
            prices: {
                scrt: scrt_price,
                sienna: sienna_price
            },
            assets: {
                sienna: (sienna_staked_balance + sienna_balance) * sienna_price,
                scrt: scrt_balance * scrt_price
            },
            lifetime_pool_share: sienna_rewards.user_share,
            height: height,
            date: new Date()
        });

        return newData;
    }
}
