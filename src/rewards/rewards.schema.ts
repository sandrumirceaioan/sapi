import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardsDocument = Rewards & Document;

@Schema()
export class Rewards {
    @Prop({ type: Number })
    it_is_now;

    @Prop({ type: Number })
    pool_last_update;

    @Prop({ type: Number })
    pool_lifetime;

    @Prop({ type: Number })
    pool_locked;

    @Prop({ type: Number })
    pool_closed

    @Prop({ type: Number })
    user_last_update;

    @Prop({ type: Number })
    user_lifetime;

    @Prop({ type: Number })
    user_locked;

    @Prop({ type: Number })
    user_share;

    @Prop({ type: Number })
    user_earned;

    @Prop({ type: Number })
    user_claimed;

    @Prop({ type: Number })
    user_claimable;

    @Prop({ type: Number })
    user_age;

    @Prop({ type: Number })
    user_cooldown;

    @Prop({ type: Number })
    sienna_balance;

    @Prop(raw({
        success: { type: String },
        error: { type: String }
    }))
    claim_result;

    @Prop({ type: Date, default: new Date().getTime() })
    date;
}

export const RewardsSchema = SchemaFactory.createForClass(Rewards);