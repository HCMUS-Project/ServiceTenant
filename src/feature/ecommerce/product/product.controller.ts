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

        // Tạo một object để lọc những bộ lọc có giá trị
        const filters = {
            name,
            category,
            price,
            rating,
        };

        // Convert filters object into an array of key-value pairs
        const entries = Object.entries(filters);

        // Declare the activeFilters variable and use Object.fromEntries() to convert the entries array back into an object
        const activeFilters: { [key: string]: string | number } = Object.fromEntries(entries);

        // Nếu không có bộ lọc nào được áp dụng, trả về tất cả sản phẩm
        if (Object.keys(activeFilters).length === 0) {
          return this.productService.findAll(domain);
        }
        // Gọi phương thức searchWithFilters và truyền các bộ lọc được áp dụng
        return this.productService.searchWithFilters(activeFilters, domain);
    }
}
