import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('api/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(createReviewDto);
    }

    @Get()
    findAll(@Headers('domain') domain: string, @Headers('product_id') product_id: string){
        return this.reviewService.findAll(domain, product_id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Headers('domain') domain: string, @Headers('product_id') product_id: string) {
        return this.reviewService.findOne(id, domain, product_id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.update(id, updateReviewDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewService.remove(id);
    }
}
