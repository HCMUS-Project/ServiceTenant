import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Headers,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    findAll(@Body() domain: string) {
        return this.productService.findAll(domain);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Body() domain: string) {
        return this.productService.findOne(id, domain);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        console.log(id);
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Body() domain: string) {
        return this.productService.remove(id, domain);
    }

    @Get('search')
    search(
        @Query() query: { name?: string; category?: string; price?: number; rating?: number },
        @Headers('domain') domain: string,
    ) {
        const { name, category, price, rating } = query;

        const filters = {
            name,
            category,
            price,
            rating,
        };

        const entries = Object.entries(filters);
        const activeFilters: { [key: string]: string | number } = Object.fromEntries(entries);

        if (Object.keys(activeFilters).length === 0) {
          return this.productService.findAll(domain);
        }
        return this.productService.searchWithFilters(activeFilters, domain);
    }

    @Post('increase-view/:id')
    increaseView(@Param('id') id: string) {
        return this.productService.increaseProductViews(id);
    }

    @Post('update-sold/:id')
    updateProductSold(@Param('id') id: string, @Body() quantity: number) {
        return this.productService.updateProductSold(id, quantity);
    }

    @Post('update-rating/:id')
    updateProductRating(@Param('id') id: string, @Body() rating: number) {
        return this.productService.updateProductRating(id, rating);
    }
}
