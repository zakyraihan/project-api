import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukDto,
  CreaterodukArrayDto,
  DeleteProdukArrayDto,
  FindProdukDto,
  UpdateProdukDto,
} from './produk.dto';
import { ResponseSuccess } from 'src/interface';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Get('/list')
  findAllBook() {
    return this.produkService.getAllProduk();
  }

  @Post('/create')
  createBook(@Body() payload: CreateProdukDto) {
    return this.produkService.createProduk(payload);
  }

  @Put('update/:id')
  updateProduk(
    @Param('id') id: string,
    @Body() updateProdukDto: UpdateProdukDto,
  ) {
    return this.produkService.updateProduk(Number(id), updateProdukDto);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.produkService.getDetailProduk(Number(id));
  }

  @Delete('delete/:id')
  deleteProduk(@Param('id') id: string) {
    return this.produkService.deleteProduct(+id);
  }

  @Post('/create/bulk')
  bulkCreateBook(@Body() payload: CreaterodukArrayDto) {
    return this.produkService.bulkCreateProduk(payload);
  }

  @Post('delete/bulk')
  deleteBulkBook(@Body() payload: DeleteProdukArrayDto) {
    return this.produkService.deleteBulkProduk(payload);
  }
}
