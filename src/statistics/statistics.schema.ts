import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticsDocument = Statistic & Document;

@Schema()
export class Statistic {
    @Prop(raw({
        sienna: {
            balance: { type: Number },
            staked: { type: Number },
            next_claim: { type: Number },
            total_rewards: { type: Number }
        },
        scrt: { type: Number }
    }))
    balances;

    @Prop(raw({
        scrt: { type: Number },
        sienna: { type: Number }
    }))
    prices;

    @Prop(raw({
        sienna: { type: Number },
        scrt: { type: Number }
    }))
    assets

    @Prop({ type: Number })
    lifetime_pool_share;

    @Prop({ type: Number })
    height;

    @Prop({ type: Date })
    date;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);