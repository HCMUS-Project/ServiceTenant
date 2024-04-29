import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Headers('domain') domain: string){
    return this.orderService.findAll(domain);
  }

  @Get('user/:user_id')
  findAllOrdersOfUser(@Param('user_id') user_id: string, @Headers('domain') domain: string){
    return this.orderService.findAllOrdersOfUser(user_id, domain);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('domain') domain: string){
    return this.orderService.findOne(id, domain);
  }

  @Get('/user/history/:user_id')
  getHistoryOrderOfUser(@Param('user_id') user_id: string, @Headers('domain') domain: string){
    return this.orderService.getHistoryOrderOfUser(user_id, domain);
  }

  @Get('/checkPurchased/user/:user_id')
  checkOrderOfUser(@Param('user_id') user_id: string, @Headers('domain') domain: string, @Headers('product_id') product_id: string){
    return this.orderService.checkUserPurchase(user_id, domain, product_id);
  }

  @Patch(':id')
  updateOrderStage(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch('confirm/:id')
  confirmOrder(@Param('id') id: string, @Headers('domain') domain: string){
    return this.orderService.confirmOrder(id, domain);
  }

  @Patch('cancel/:id')
  cancelOrder(@Param('id') id: string, @Headers('domain') domain: string){
    return this.orderService.cancelOrder(id, domain);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
