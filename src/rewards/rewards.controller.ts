import { Controller, Post, Get, Put, Body, Query, Param, UseFilters, Delete, Request, UseGuards, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageCodeError } from '../../common/errors/error.module';
import { RewardsService } from './rewards.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { SecretService } from '../secret/secret.service';

@Controller('rewards')
export class RewardsController {

    constructor(
        private secretService: SecretService,
        private rewardsService: RewardsService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/status')
    async getRewardsStatus() {
        return await this.secretService.getRewardsData();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/claim')
    async claimRewards(@Body() params) {

        let reward = JSON.parse(JSON.stringify(params));
        reward['claim_result'] = {
            success: null,
            error: null
        };

        let result = await this.secretService.claimRewards();
        if (result.success) {
            if (result.claim) {
                reward.claim_result.success = JSON.stringify(result.claim);
            } else {
                if (result.error) {
                    reward.claim_result.error = JSON.stringify(result.error);
                }
            }
        } else {
            reward.claim_result.error = JSON.stringify(result.error);
        }

        let created = await this.rewardsService.create(reward);
        return created;
    }

}