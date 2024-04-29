import { Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import exp from 'constants';

@Injectable()
export class VoucherService {
    constructor(private prismaService: PrismaService) {}

    async create(createVoucherDto: CreateVoucherDto) {
        try{
            const exprire_at = new Date(createVoucherDto.expire_at);
            const voucher = this.prismaService.voucher.create({
                data: {
                    domain: createVoucherDto.domain,
                    voucher_name: createVoucherDto.voucher_name,
                    voucher_code: createVoucherDto.voucher_code,
                    max_discount: createVoucherDto.max_discount,
                    min_app_value: createVoucherDto.min_app_value,
                    discount_percent: createVoucherDto.discount_percent,
                    expire_at: exprire_at,
                },
            });
            return voucher;
        }
            catch (error) {
                throw new Error(error.message);
            }
        }
    

    async findAll(domain: string) {
        try{
            if (!domain) {
                throw new Error('Domain is required');
            }
            const voucher = this.prismaService.voucher.findMany({
                where: {
                    domain: domain,
                },
            });
            return voucher;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    async findOne(id: string, domain: string) {
        try{
            if (!domain) {
                throw new Error('Domain is required');
            }
            const voucher = this.prismaService.voucher.findUnique({
                where: {
                    id: id,
                    domain: domain,
                },
            });
            return voucher;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    async getVoucherByCode(voucher_code: string, domain: string) {
        try{
            if (!voucher_code) {
                throw new Error('Voucher code is required');
            }
            if (!domain) {
                throw new Error('Domain is required');
            }
            const voucher = this.prismaService.voucher.findFirst({
                where: {
                    voucher_code: voucher_code,
                    domain: domain,
                },
            });
            return voucher;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    async update(id: string, updateVoucherDto: UpdateVoucherDto) {
        if (updateVoucherDto.domain === undefined || updateVoucherDto.domain === '') {
            throw new Error('Domain is required');
        }
        const newData = {
            ...updateVoucherDto,
            expire_at: new Date(updateVoucherDto.expire_at),
        };
        console.log(newData);
        
        try{
            const voucher = this.prismaService.voucher.update({
                where: {
                    id: id,
                },
                data: {
                    ...newData,
                },
            });
            return voucher;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    remove(id: string) {
        try{
            const voucher = this.prismaService.voucher.delete({
                where: {
                    id: id,
                },
            });
            return voucher;
        }
        catch(error){
            throw new Error(error.message);
        }
    }
}
