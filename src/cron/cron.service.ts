import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment'
import { SecretService } from "../secret/secret.service";
import { StatisticsService } from "../statistics/statistics.service";

@Injectable()
export class CronService {
    constructor(
        private secretService: SecretService,
        private statisticsService: StatisticsService
    ) {

    }

    async getStatistics() {
        const height = await this.secretService.getHeight();

        const sienna_price = await this.secretService.getPrice('sienna');
        const scrt_price = await this.secretService.getPrice('secret');
        
        const sienna_balance = await this.secretService.getBalance('SIENNA');
        const sienna_staked_balance = await this.secretService.getBalance('SIENNA_REWARDS');
        const scrt_balance = await this.secretService.getSCRTBalance();

        const sienna_rewards: any = await this.secretService.getRewardsData();
    
        await this.statisticsService.create({
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

    }

}