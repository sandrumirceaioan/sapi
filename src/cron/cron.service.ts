import { Injectable } from '@nestjs/common';
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
        const sienna_balance = await this.secretService.getBalance('SIENNA');
        const sienna_staked = await this.secretService.getBalance('SIENNA_REWARDS');
        const sienna_rewards: any = await this.secretService.getClaimableRewards('SIENNA_REWARDS');
        const scrt_price = await this.secretService.getPrice('secret');
        const scrt_balance = await this.secretService.getSCRTBalance();
        
        // console.log('sienna_price: ', sienna_price);
        // console.log('sienna_balance: ', sienna_balance);
        // console.log('sienna_staked: ', sienna_staked);
        // console.log('sienna_rewards: ', sienna_rewards);
        // console.log('scrt_price: ', scrt_price);
        // console.log('scrt_balance: ', scrt_balance);

        await this.statisticsService.create({
            balances: {
                sienna: {
                    balance: sienna_balance,
                    staked: sienna_staked,
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
                sienna: (sienna_staked + sienna_balance) * sienna_price,
                scrt: scrt_balance * scrt_price
            },
            lifetime_pool_share: sienna_rewards.user_share,
            height: height,
            date: new Date()
        });

    }

}