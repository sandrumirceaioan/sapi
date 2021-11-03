
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CosmWasmClient } from 'secretjs';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';

@Injectable()
export class SecretService {
    private viewingKeys = {};
    private contractAddresses = {};
    private client;
    private LCD_HOST;
    private WALLET;
    private SIENNA_DECIMALS;
    private SCRT_DECIMALS;
    private COINGECKO_URL;
    public current_prices = {};
    public current_height = 0;

    constructor(private configService: ConfigService) {
        this.LCD_HOST = this.configService.get('LCD_HOST');
        this.client = new CosmWasmClient(this.LCD_HOST);
        this.WALLET = this.configService.get('WALLET')
        this.SIENNA_DECIMALS = parseInt(this.configService.get('SIENNA_DECIMALS'))
        this.SCRT_DECIMALS = parseInt(this.configService.get('SCRT_DECIMALS'))
        this.viewingKeys = {
            SIENNA: this.configService.get('SIENNA_V_KEY'),
            SIENNA_REWARDS: this.configService.get('SIENNA_REWARDS_V_KEY')
        }
        this.contractAddresses = {
            SIENNA: this.configService.get('SIENNA_CONTRACT_ADDRESS'),
            SIENNA_REWARDS: this.configService.get('SIENNA_REWARDS_CONTRACT_ADDRESS')
        }

        this.COINGECKO_URL = this.configService.get('COINGECKO_URL')
    }


    async getPrice(symbol) {
        return axios.get(`${this.COINGECKO_URL}/simple/price?ids=${symbol}&vs_currencies=usd`).then((data: any) => {
            this.current_prices[symbol] = data.data[symbol].usd;
            return data.data[symbol].usd;
        }).catch(() => {
            return 0;
        });
    }

    async getHeight() {
        this.current_height = await this.client.getHeight();
        return await this.client.getHeight();
    }

    async getBalance(type): Promise<number> {
        const data = await this.client.queryContractSmart(this.contractAddresses[type], {
            balance: {
                address: this.WALLET,
                key: this.viewingKeys[type],
            },
        });

        return this.formatBalance(data.balance.amount, this.SIENNA_DECIMALS);
    }

    async getSCRTBalance() {
        const data = await this.client.getAccount(this.WALLET);
        const uscrt = data.balance.find(balance => balance.denom === 'uscrt');
        return this.formatBalance(uscrt.amount, this.SCRT_DECIMALS);
    }

    async getClaimableRewards(type) {
        const data = await this.client.queryContractSmart(this.contractAddresses[type], {
            user_info: {
                address: this.WALLET,
                key: this.viewingKeys[type],
                at: this.current_height
            }
        });
        console.log(data);
        return {
            claimable: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
            user_earned: this.formatBalance(data.user_info.user_earned, this.SIENNA_DECIMALS),
            user_share: this.formatBalance(data.user_info.user_share, 6),
        };
    }

    formatBalance(amount: number, decimals): number {
        return new BigNumber(amount).shiftedBy(Number(-decimals)).toNumber();
    }
}