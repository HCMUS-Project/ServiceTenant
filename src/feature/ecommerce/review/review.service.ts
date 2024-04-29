import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from '../product/product.service';
import { OrderModule } from '../order/order.module';

@Injectable()
export class ReviewService {
    constructor(private prismaService: PrismaService,
        private productService: ProductService,
        private orderModule: OrderModule,
    ) {}

    async create(createReviewDto: CreateReviewDto) {
        try{
            
            const review = await this.prismaService.review.create({
                data: {
                    domain: createReviewDto.domain,
                    product_id: createReviewDto.product_id,
                    user_id: createReviewDto.user_id,
                    rating: createReviewDto.rating,
                    review: createReviewDto.review,
                },
            });
            this.productService.updateProductRating(createReviewDto.product_id, createReviewDto.rating);

            return review;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    findAll(domain: string, product_id: string) {
        try{
            const reviews = this.prismaService.review.findMany({
                where: {
                    domain: domain,
                    product_id: product_id,
                },
            });
            return reviews;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    findOne(id: string, domain: string, product_id: string) {
        try{
            const review = this.prismaService.review.findUnique({
                where: {
                    id: id,
                    domain: domain,
                    product_id: product_id,
                },
            });
            return review;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    update(id: string, updateReviewDto: UpdateReviewDto) {
        try{
            const review = this.prismaService.review.update({
                where: {
                    id: id,
                },
                data: {
                    ...updateReviewDto,
                },
            });
            return review;
        }
        catch(error){
            throw new Error(error.message);
        }
    }

    remove(id: string) {
        try{
            const review = this.prismaService.review.delete({
                where: {
                    id: id,
                },
            });
            return review;
        }
        catch(error){
            throw new Error(error.message);
        }
    }
}
