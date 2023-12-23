import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { ProdukEntity } from './produk.entity';
import { Between, Like, Repository } from 'typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import {
  CreateProdukDto,
  CreaterodukArrayDto,
  DeleteProdukArrayDto,
  FindProdukDto,
  ProdukDto,
  UpdateProdukDto,
} from './produk.dto';

@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(ProdukEntity)
    private readonly produkRepository: Repository<ProdukEntity>,
  ) {
    super();
  }

  async getAllProduk(): Promise<ResponseSuccess> {
    const result = await this.produkRepository.find();
    return {
      status: 'Success',
      message: 'List produk ditermukan',
      data: result,
    };
  }

  async createProduk(payload: CreateProdukDto): Promise<ResponseSuccess> {
    try {
      const {
        nama_produk,
        kategori_produk,
        harga_produk,
        jumlah_produk,
        tahun_pembuatan,
        deskripsi_produk,
      } = payload;

      const bookSave = await this.produkRepository.save({
        nama_produk: nama_produk,
        kategori_produk: kategori_produk,
        harga_produk: harga_produk,
        jumlah_produk: jumlah_produk,
        tahun_pembuatan: tahun_pembuatan,
        deskripsi_produk: deskripsi_produk,
      });

      return this._success('Berhasil Menambah Produk', bookSave); // implementasi method _success disini
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateProduk(
    id: number,
    produkBookDto: UpdateProdukDto,
  ): Promise<ResponseSuccess> {
    const check = await this.produkRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`produk dengan id ${id} tidak ditemukan`);
    const update = await this.produkRepository.save({
      ...produkBookDto,
      id: id,
    });
    return this._success('Berhasil Update produk', update); // implementasi method _success disini
  }

  async getDetailProduk(id: number): Promise<ResponseSuccess> {
    const detailProduk = await this.produkRepository.findOne({
      where: {
        id,
      },
    });

    if (detailProduk === null) {
      throw new NotFoundException(`product dengan id ${id} tidak ditemukan`);
    }
    return this._success('Berhasil mendapatkan product', detailProduk); // implementasi method _success disini
  }

  async deleteProduct(id: number): Promise<ResponseSuccess> {
    const check = await this.produkRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Product dengan id ${id} tidak ditemukan`);
    await this.produkRepository.delete(id);
    return this._success('Berhasil Menghapus Product'); // implementasi method _success disini
  }

  async bulkCreateProduk(
    paylaod: CreaterodukArrayDto,
  ): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        paylaod.data.map(async (item) => {
          try {
            await this.produkRepository.save(item);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `berhasil menambah produk sebanyak ${berhasil}, dan gagal sebanyak ${gagal}`,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  async deleteBulkProduk(
    check: DeleteProdukArrayDto,
  ): Promise<ResponseSuccess> {
    console.log('pay', check);
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        check.data.map(async (id) => {
          try {
            const del = await this.produkRepository.delete(id);
            if (del.affected === 1) {
              berhasil = berhasil + 1;
            } else {
              gagal = gagal + 1;
            }
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menghapus produk ${berhasil} dan gagal ${gagal}`,
        data: check,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
