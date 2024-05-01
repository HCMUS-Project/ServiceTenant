import {
    Cart,
    CartItem,
    CartResponse,
    CreateCartRequest,
    DeleteCartRequest,
    FindAllCartsByUserIdRequest,
    FindAllCartsResponse,
    FindCartByIdRequest,
    UpdateCartRequest,
} from 'src/proto_build/e_commerce/cart_pb';

export interface ICartItem extends CartItem.AsObject {}

export interface ICart extends Omit<Cart.AsObject, 'cartItemsList'> {
    cartItems: ICartItem[];
}

// export interface ICartResponse extends CartResponse.AsObject{}
export interface ICartResponse{
    cart?: ICart;
}

export interface ICreateCartRequest extends Omit<CreateCartRequest.AsObject, 'cartItemsList'> {
    cartItems: ICartItem[];
}
export interface ICreateCartResponse extends ICartResponse {}

export interface IFindAllCartsByUserIdRequest extends FindAllCartsByUserIdRequest.AsObject {}
export interface IFindAllCartsByUserIdResponse {
    carts: ICart[];
}

export interface IFindCartByIdRequest extends FindCartByIdRequest.AsObject{}
export interface IFindCartByIdResponse extends ICartResponse{}

export interface IUpdateCartRequest extends Omit<UpdateCartRequest.AsObject, 'cartItemsList'> {
    cartItems: ICartItem[];
}
export interface IUpdateCartResponse extends ICartResponse{}

export interface IDeleteCartRequest extends DeleteCartRequest.AsObject{}
export interface IDeleteCartResponse extends ICartResponse{}