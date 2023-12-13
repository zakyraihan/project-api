import { Module } from '@nestjs/common';
import { KategoryController } from './kategory.controller';
import { KategoryService } from './kategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategory } from './katgory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kategory])],
  controllers: [KategoryController],
  providers: [KategoryService],
})
export class KategoryModule {}
