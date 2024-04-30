import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
    ICreateProductRequest,
    ICreateProductResponse,
    IDeleteProductRequest,
    IDeleteProductResponse,
    IFindAllProductsRequest,
    IFindAllProductsResponse,
    IFindProductByIdRequest,
    IFindProductByIdResponse,
    IProductResponse,
    ISearchProductsRequest,
    ISearchProductsResponse,
    IUpdateProductRequest,
    IUpdateProductResponse,
} from './interface/product.interface';
import { SupabaseService } from 'src/util/supabase/supabase.service';

@Controller()
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @GrpcMethod('ProductService', 'CreateProduct')
    async create(data: ICreateProductRequest): Promise<ICreateProductResponse> {
        return await this.productService.create(data);
    }

    @GrpcMethod('ProductService', 'FindAllProducts')
    async findAll(data: IFindAllProductsRequest): Promise<IFindAllProductsResponse> {
        return await this.productService.findAll(data);
    }

    @GrpcMethod('ProductService', 'FindProductById')
    async findOneById(data: IFindProductByIdRequest): Promise<IFindProductByIdResponse> {
        return await this.productService.findOneById(data);
    }

    @GrpcMethod('ProductService', 'UpdateProduct')
    async update(data: IUpdateProductRequest): Promise<IUpdateProductResponse> {
        return await this.productService.update(data);
    }

    @GrpcMethod('ProductService', 'DeleteProduct')
    async remove(data: IDeleteProductRequest): Promise<IDeleteProductResponse> {
        return await this.productService.remove(data);
    }

    @GrpcMethod('ProductService', 'SearchProducts')
    async search(data: ISearchProductsRequest): Promise<ISearchProductsResponse> {
        const { user, ...dataSearch } = data; 

        // const filters = {
        //     name,
        //     category,
        //     min_price: min_price,
        //     max_price: max_price,
        //     rating,
        // };

        const entries = Object.entries(dataSearch);
        const activeFilters: { [key: string]: string | number } = Object.fromEntries(entries);

        if (Object.keys(activeFilters).length === 0) {
            return await this.productService.findAll({user: user}) 
        }
        return await this.productService.searchWithFilters(data);
    }
}
