import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('api/cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartService.create(createCartDto);
    }

    @Get(':id')
    findAll(@Param('id') id: string, @Headers('domain') domain: string) {
        return this.cartService.findById(id, domain);
    }

    @Get('/user/:id')
    findOne(@Param('id') id: string, @Headers('domain') domain: string){
        return this.cartService.findByUserId(id, domain);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.update(id, updateCartDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cartService.remove(id);
    }
}
