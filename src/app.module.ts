import { Module } from '@nestjs/common';
import {RegisterModule} from './register/Register.Module'

@Module({
  imports: [RegisterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
