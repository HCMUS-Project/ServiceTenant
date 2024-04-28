import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Headers,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';

@Controller('api/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    findAll(@Headers('domain') domain: string) {
        return this.categoryService.findAll(domain);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('domain') domain: string) {
        return this.categoryService.findOne(id, domain);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Headers('domain') domain: string) {
        return this.categoryService.remove(id, domain);
    }
}
