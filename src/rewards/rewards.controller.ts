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

    // @UseGuards(AuthGuard('jwt'))
    // @Get('/claim')
    // async claimRewards() {
    //     return await this.secretService.claimRewards();
    // }

    

}