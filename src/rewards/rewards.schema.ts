import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardsDocument = Rewards & Document;

@Schema()
export class Rewards {
    @Prop({ type: Number })
    userAge;

    @Prop({ type: Number })
    totalClaimed;

    @Prop({ type: Number })
    totalEarned;

    @Prop({ type: Number })
    userShare;
    
    @Prop({ type: Number })
    userLifetime

    @Prop({ type: Number })
    userLastUpdate;

    @Prop({ type: Number })
    poolLifetime;

    @Prop({ type: Number })
    poolLocked;

    @Prop({ type: Number })
    poolLastUpdate;

    @Prop({ type: Date })
    date;
}

export const RewardsSchema = SchemaFactory.createForClass(Rewards);