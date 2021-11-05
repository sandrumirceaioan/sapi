
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { CosmWasmClient } from 'secretjs';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import { PatchedSigningCosmWasmClient } from './PatchedSigningCosmWasmClient';
import { BroadcastMode, Secp256k1Pen, SigningCosmWasmClient } from 'secretjs';

@Injectable()
export class SecretService implements OnModuleInit {
    private viewingKeys = {};
    private contractAddresses = {};
    private client: SigningCosmWasmClient;
    private LCD_HOST;
    private WALLET;
    private MNEMONIC;
    private SIENNA_DECIMALS;
    private SCRT_DECIMALS;
    private COINGECKO_URL;
    public current_height = 0;

    constructor(private configService: ConfigService) {
        this.LCD_HOST = this.configService.get('LCD_HOST');
        this.WALLET = this.configService.get('WALLET');
        this.MNEMONIC = this.configService.get('MNEMONIC');
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

    async onModuleInit() {
        const pen = await Secp256k1Pen.fromMnemonic(this.MNEMONIC);
        this.client = new PatchedSigningCosmWasmClient(this.LCD_HOST, this.WALLET, (signBytes) => pen.sign(signBytes), null, null, BroadcastMode.Sync);
    }

    // get height
    async getHeight() {
        this.current_height = await this.client.getHeight();
        return await this.client.getHeight();
    }

    // get secret network account
    async getAccount(walletId) {
        return await this.client.getAccount(walletId);
    }

    // get coingecko prices
    async getPrice(symbol) {
        return axios.get(`${this.COINGECKO_URL}/simple/price?ids=${symbol}&vs_currencies=usd`).then((data: any) => {
            return data.data[symbol].usd;
        }).catch(() => {
            return 0;
        });
    }

    // get sienna balance 
    async getBalance(type): Promise<number> {
        const data = await this.client.queryContractSmart(this.contractAddresses[type], {
            balance: {
                address: this.WALLET,
                key: this.viewingKeys[type],
            },
        });

        return this.formatBalance(data.balance.amount, this.SIENNA_DECIMALS);
    }

    // get secret balance
    async getSCRTBalance() {
        const data = await this.getAccount(this.WALLET);
        const uscrt = data.balance.find(balance => balance.denom === 'uscrt');
        return this.formatBalance(uscrt.amount, this.SCRT_DECIMALS);
    }

    // get sienna rewards
    async getRewardsData() {
        try {
            const data = await this.client.queryContractSmart(this.contractAddresses['SIENNA_REWARDS'], {
                user_info: {
                    address: this.WALLET,
                    key: this.viewingKeys['SIENNA_REWARDS'],
                    at: this.current_height
                }
            });
            console.log('OK');
            return {
                it_is_now: 739427,
                pool_last_update: 739385,
                pool_lifetime: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                pool_locked: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                pool_closed: null,
                user_last_update: 736669,
                user_lifetime: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                user_locked: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                user_share: this.formatBalance(data.user_info.user_share, 6),
                user_earned: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                user_claimed: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                user_claimable: this.formatBalance(data.user_info.user_claimable, this.SIENNA_DECIMALS),
                user_age: 125814,
                user_cooldown: 9742
            }

        } catch (e) {
            console.log(e);
            return true;
        }
    }

    // claim sienna rewards
    async claimRewards() {
        try {
            const claim = await this.client.execute(this.contractAddresses['SIENNA_REWARDS'], { claim: {} }, undefined, undefined, this.create_fee('120000', '450000'), 'c1dc8261059fee1de9f1873cd1359ccd7a6bc5623772661fa3d55332eb652084');
            console.log(claim);
            console.log(JSON.stringify(claim));
        } catch (e) {
            console.log('transaction failed: ', e.toString());
        }
    }

    // helper functions
    formatBalance(amount: any, decimals): number {
        return new BigNumber(amount).shiftedBy(Number(-decimals)).toNumber();
    }

    create_fee(amount, gas = undefined) {
        if (!gas) {
            gas = amount;
        }
        return {
            amount: [{ amount, denom: "uscrt" }],
            gas,
        };
    }
}