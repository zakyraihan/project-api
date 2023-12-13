import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsSemVer, IsString } from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class KategoryDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_kategory: string;
}

export class CreateKategoryDto extends OmitType(KategoryDto, ['id']) {}
export class FindAllKategory extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kategory: string;
}
