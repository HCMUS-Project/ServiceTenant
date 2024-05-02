import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateReviewRequest } from 'src/proto_build/e_commerce/review_pb';
import { ICreateReviewResponse } from './interface/review.interface';
import { ICreateCartRequest } from '../cart/interface/cart.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';

@Injectable()
export class ReviewService {
    constructor(private prismaService: PrismaService) {}

    // async create(dataRequest: ICreateCartRequest): Promise<ICreateReviewResponse> {
    //     const { user, ...data } = dataRequest;
    //     // console.log(dataRequest);
    //     // check role of user
    //     // if (user.role.toString() !== getEnumKeyByEnumValue(Role, Role.TENANT)) {
    //     //     throw new GrpcPermissionDeniedException('PERMISSION_DENIED');
    //     // }
    //     try {
    //         const userPurchased = await this..checkUserPurchase(
    //             createReviewDto.user_id,
    //             createReviewDto.domain,
    //             createReviewDto.product_id,
    //         );
    //         if (userPurchased === false) {
    //             throw new Error('User has not purchased this product');
    //         }
    //         let review;
    //         const reviewExists = await this.prismaService.review.findFirst({
    //             where: {
    //                 domain: createReviewDto.domain,
    //                 product_id: createReviewDto.product_id,
    //                 user_id: createReviewDto.user_id,
    //             },
    //         });
    //         console.log(reviewExists);
    //         if (reviewExists !== null) {
    //             review = this.prismaService.review.update({
    //                 where: {
    //                     id: reviewExists.id,
    //                 },
    //                 data: {
    //                     rating: createReviewDto.rating,
    //                     review: createReviewDto.review,
    //                 },
    //             });
    //             this.productService.updateProductRating(
    //                 createReviewDto.product_id,
    //                 createReviewDto.rating,
    //             );
    //         } else {
    //             review = await this.prismaService.review.create({
    //                 data: {
    //                     domain: createReviewDto.domain,
    //                     product_id: createReviewDto.product_id,
    //                     user_id: createReviewDto.user_id,
    //                     rating: createReviewDto.rating,
    //                     review: createReviewDto.review,
    //                 },
    //             });
    //             this.productService.updateProductRating(
    //                 createReviewDto.product_id,
    //                 createReviewDto.rating,
    //             );
    //         }

    //         return review;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // }
    // findAll() {
    //   return `This action returns all review`;
    // }

    // findOne(id: number) {
    //   return `This action returns a #${id} review`;
    // }

    // update(id: number, updateReviewDto: UpdateReviewDto) {
    //   return `This action updates a #${id} review`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} review`;
    // }
}
