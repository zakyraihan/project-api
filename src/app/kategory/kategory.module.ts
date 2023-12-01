import { Module } from '@nestjs/common';
import { KategoryController } from './kategory.controller';
import { KategoryService } from './kategory.service';

@Module({
  controllers: [KategoryController],
  providers: [KategoryService]
})
export class KategoryModule {}
