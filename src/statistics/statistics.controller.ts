import { Controller, Post, Get, Put, Body, Query, Param, UseFilters, Delete, Request, UseGuards, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageCodeError } from '../../common/errors/error.module';
import { StatisticsService } from './statistics.service';


@Controller('statistics')
export class StatisticsController {

    constructor(
        private statisticsService: StatisticsService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/latest')
    async getLatest() {
        return this.statisticsService.findOne({}, { prices: 1, assets: 1, balances: 1 }, { sort: { 'date': -1 } });
    }

}