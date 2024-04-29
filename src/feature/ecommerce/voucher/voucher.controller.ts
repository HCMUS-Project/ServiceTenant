import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller('api/voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Post()
    create(@Body() createVoucherDto: CreateVoucherDto) {
        return this.voucherService.create(createVoucherDto);
    }

    @Get()
    findAll(@Headers('domain') domain: string){
        return this.voucherService.findAll(domain);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('domain') domain: string){
        return this.voucherService.findOne(id, domain);
    }

    @Get('voucher_code/:voucher_code')
    checkVoucher(@Param('voucher_code') voucher_code: string, @Headers('domain') domain: string){
        return this.voucherService.getVoucherByCode(voucher_code, domain);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
        return this.voucherService.update(id, updateVoucherDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.voucherService.remove(id);
    }
}
