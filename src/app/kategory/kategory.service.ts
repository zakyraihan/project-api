import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Kategory } from './katgory.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { KategoryDto } from './kategory.dto';
import { ResponseSuccess } from 'src/interface';

@Injectable()
export class KategoryService extends BaseResponse {
  constructor(
    @InjectRepository(Kategory)
    private readonly kategoryRepository: Repository<Kategory>,
    @Inject(REQUEST) private req: any, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: KategoryDto): Promise<ResponseSuccess> {
    try {
      await this.kategoryRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
      });
      return this._success('Ok', this.req.user.user_id);
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  
  

}
