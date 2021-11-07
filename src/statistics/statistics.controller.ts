import { Controller, Post, Get, Put, Body, Query, Param, UseFilters, Delete, Request, UseGuards, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageCodeError } from '../../common/errors/error.module';
import { StatisticsService } from './statistics.service';
import * as moment from 'moment';
import * as _ from 'underscore';

@Controller('statistics')
export class StatisticsController {

    constructor(
        private statisticsService: StatisticsService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/latest')
    async getLatest() {
        return await this.statisticsService.findOne({}, { prices: 1, assets: 1, balances: 1 }, { sort: { 'date': -1 } });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/prices')
    async getLatestPrices(@Param('period') period) {

        try {
            let query: any;
            if (period === 'days') {
                query = { date: { $gte: moment().subtract(1, 'days') } };
                console.log(query);
            }

            let results = await this.statisticsService.find(query, { prices: 1, date: 1 }, { sort: { 'date': 1 } });
            let timeline: any = [];

            results.forEach(item => {
                if (timeline.length === 0) {
                    timeline.push(item);
                } else {
                    let lastEntry = timeline[timeline.length - 1];
                    if (item.prices.sienna !== lastEntry.prices.sienna) {
                        timeline.push(item);
                    }
                }
            });

            timeline.map(item => {
                item.date = moment(item.date).format('HH:mm')
                return item;
            });

            let siennaData = {
                name: 'Sienna',
                series: timeline.map(item => {
                    return {
                        name: item.date,
                        value: item.prices.sienna
                    };
                })
            };

            let latest = await this.getLatest();

            siennaData.series.push({
                name: moment(latest.date).format('HH:mm'),
                value: latest.prices.sienna
            });

            let response: any = [];
            response.push(siennaData);
            return response;

        } catch (e) {
            console.log(e);
            return true;
        }

    }

}