import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import {ICreateReviewRequest, ICreateReviewResponse} from './interface/review.interface';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // @GrpcMethod('ReviewService', 'CreateReview')
  // async create(data: ICreateReviewRequest): Promise<ICreateReviewResponse> {
  //     return await this.reviewService.create(data);
  // }

  // @MessagePattern('findAllReview')
  // findAll() {
  //   return this.reviewService.findAll();
  // }

  // @MessagePattern('findOneReview')
  // findOne(@Payload() id: number) {
  //   return this.reviewService.findOne(id);
  // }

  // @MessagePattern('updateReview')
  // update(@Payload() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewService.update(updateReviewDto.id, updateReviewDto);
  // }

  // @MessagePattern('removeReview')
  // remove(@Payload() id: number) {
  //   return this.reviewService.remove(id);
  // }
}
