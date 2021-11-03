import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecretController } from './secret.controller';
import { SecretService } from './secret.service';

@Module({
  imports: [],
  controllers: [SecretController],
  providers: [SecretService],
  exports: [SecretService]
})
export class SecretModule { }
