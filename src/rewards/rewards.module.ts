import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './rewards.controller';
import { RewardsSchema } from './rewards.schema';
import { RewardsService } from './rewards.service';
import { Rewards } from './rewards.schema';
import { SecretModule } from '../secret/secret.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rewards.name, schema: RewardsSchema }]),
    SecretModule
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService]
})
export class RewardsModule { }
