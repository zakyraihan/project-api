import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { KategoriProduk } from './produk.entity';
import { OmitType } from '@nestjs/mapped-types';
import { PageRequestDto } from 'src/utils/dto/page.dto';
import { Type } from 'class-transformer';

export class ProdukDto {
  id: number;

  @MinLength(5)
  nama_produk: string;

  @IsEnum(KategoriProduk)
  kategori_produk: KategoriProduk;

  @Min(10000)
  harga_produk: number;

  jumlah_produk: number;

  deskripsi_produk: string;

  @Min(2010)
  @Max(2023)
  tahun_pembuatan: number;
}

export class CreateProdukDto extends OmitType(ProdukDto, ['id']) {}
export class UpdateProdukDto extends OmitType(ProdukDto, ['id']) {}

export class CreaterodukArrayDto {
  @IsArray()
  @Type(() => CreateProdukDto)
  data: CreateProdukDto[];
}

export class DeleteProdukArrayDto {
  @IsArray()
  data: number[];
}

export class FindProdukDto extends PageRequestDto {
  @IsOptional()
  nama_produk: string;

  @IsOptional()
  @IsString()
  kategori_produk: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  harga_produk: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  jumlah_produk: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_year: number;
}
