import { CreateReviewRequest, Review, ReviewResponse } from 'src/proto_build/e_commerce/review_pb';

export interface IReview extends Review.AsObject {}
export interface IReviewResponse {
    review: IReview;
}

export interface ICreateReviewRequest extends CreateReviewRequest.AsObject {}
export interface ICreateReviewResponse extends ReviewResponse{}

