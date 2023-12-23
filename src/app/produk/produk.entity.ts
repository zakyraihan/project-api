import { IsEnum, IsNotEmpty, Min, MinLength } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProdukEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama_produk: string;

  @Column()
  @IsNotEmpty()
  kategori_produk: KategoriProduk;

  @Column()
  harga_produk: number;

  @Column()
  jumlah_produk: number;

  @Column({ nullable: false })
  deskripsi_produk: string;

  @Column({ nullable: false })
  tahun_pembuatan: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_date: Date;
}

export enum KategoriProduk {
  Handphone = 'handphone',
  Laptop = 'laptop',
  Mobil = 'mobil',
  Motor = 'motor',
}
