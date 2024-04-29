import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from '../product/product.service';
import { VoucherService } from '../voucher/voucher.service';

@Injectable()
export class OrderService {
  constructor (private prismaService: PrismaService
    , private ProductService: ProductService
    , private VoucherService: VoucherService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try{
      for (let i = 0; i < createOrderDto.products_id.length; i++) {
        const product = await this.ProductService.findOne(createOrderDto.products_id[i], createOrderDto.domain);
        if (product.quantity < createOrderDto.quantities[i]) {
            throw new Error(`Quantity of product ${product.name} is not enough`);
        }
      }

      const total_price = await this.calculateTotalPrice(createOrderDto.products_id, createOrderDto.quantities);
      let price_after_voucher = total_price;
      let discount_value = 0;
      if (createOrderDto.voucher_id !== undefined) {
        const voucher_applied = await this.VoucherService.findOne(createOrderDto.voucher_id, createOrderDto.domain);
        
        if (total_price < Number(voucher_applied.min_app_value)) {
          throw new Error('Total price is not enough to apply this voucher');
        }
        else {
          discount_value = total_price * Number(voucher_applied.discount_percent) / 100;
          if (discount_value > total_price) {
            price_after_voucher = 0;
          }
          if (discount_value > Number(voucher_applied.max_discount)) {
            discount_value = Number(voucher_applied.max_discount);
            price_after_voucher = total_price - Number(voucher_applied.max_discount);
          }
          else {
            price_after_voucher = total_price - discount_value;
          }
        }
      }
      
      const order = this.prismaService.order.create({
        data: {
          domain: createOrderDto.domain,
          user_id: createOrderDto.user_id,
          stage: "pending",
          orderItems: {
            create: createOrderDto.products_id.map((productId, index) => ({
              product: { connect: { id: productId } },
              quantity: createOrderDto.quantities[index],
            })),
          },
          total_price: total_price,
          voucher_id: createOrderDto.voucher_id,
          voucher_discount: discount_value,
          price_after_voucher: price_after_voucher,
        },
      });
      return order;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async confirmOrder(id: string, domain: string) {
    try{
      const order = await this.prismaService.order.findUnique({
        where: {
          id: id,
          domain: domain,
        },
        include: {
          orderItems: {
            include: {
              product: true, // Include product information
            }
          }
        },
      });
      // update product sold and quantity
      for (let i = 0; i < order.orderItems.length; i++) {
        await this.ProductService.updateProductSold(order.orderItems[i].product_id, order.orderItems[i].quantity);
      }
      const orderUpdated = this.prismaService.order.update({
        where: {
          id: id,
        },
        data: {
          stage: "shipping",
        },
      });
      return orderUpdated;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async cancelOrder(id: string, domain: string) {
    try{
      const order = await this.prismaService.order.findUnique({
        where: {
          id: id,
          domain: domain,
        }
      });
      if (order.stage !== "pending") {
        throw new Error('Order is not cancellable.');
      }

      const orderUpdated = this.prismaService.order.update({
        where: {
          id: id,
        },
        data: {
          stage: "cancelled",
        },
      });
      return orderUpdated;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(domain: string) {
    try{
      return this.prismaService.order.findMany({
        where: {
          domain: domain,
        },
        include: {
          orderItems: true,
        },
      });
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllOrdersOfUser(user_id: string, domain: string) {
    try{
      return this.prismaService.order.findMany({
        where: {
          user_id: user_id,
          domain: domain,
        },
        include: {
          orderItems: true,
        },
      });
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: string, domain: string) {
    try{
      return this.prismaService.order.findUnique({
        where: {
          id: id,
          domain: domain,
        },
        include: {
          orderItems: true,
        },
      });
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try{
      return this.prismaService.order.update({
        where: {
          id: id,
        },
        data: {
          stage: updateOrderDto.stage,
        },
      });
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async getHistoryOrderOfUser(user_id: string, domain: string) {
    try{
      return this.prismaService.order.findMany({
        where: {
          user_id: user_id,
          domain: domain,
          stage: "completed",
        },
        include: {
          orderItems: true,
        },
      });
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  async checkOrderOfUser(user_id: string, id: string, domain: string) {
    try{
      const order = await this.findOne(id, domain)
      if (order === undefined || order === null) {
        throw new Error('Order not found');
      }

      if (order.user_id !== user_id) {
        throw new Error('User don\'t purchase this order');
      }
      const checkOrder = await this.prismaService.order.findUnique({
        where: {
          id: id,
          user_id: user_id,
          domain: domain,
        },
        include: {
          orderItems: true,
        },
      });
      return checkOrder.stage;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }

  remove(id: string) {
    try{
      return this.prismaService.order.delete({
        where: {
          id: id,
        },
      });
    }
    catch(error){
      throw new Error('Failed to delete order. Please try again.');
    }
  }

  async calculateTotalPrice(productIds: string[], quantities: number[]): Promise<number> {
    try {
        // Khởi tạo tổng giá là 0
        let totalPrice: number = 0;

        // Duyệt qua từng productId và tính giá cho từng sản phẩm
        for (let i = 0; i < productIds.length; i++) {
            // Lấy giá của sản phẩm từ productService
            const price = await this.ProductService.getPriceOfProduct(productIds[i]);

            // Tính tổng giá dựa trên giá của sản phẩm và số lượng
            totalPrice = Number(totalPrice) + Number(price) * quantities[i];
        }

        return totalPrice;
    } catch (error) {
      throw new Error('Failed to calculate total price. Please try again.');
    }
  }
}
