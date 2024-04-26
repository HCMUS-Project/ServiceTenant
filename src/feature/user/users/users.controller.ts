import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Get all user (test successfully)
    @Get('')
    findAll() {
        return this.usersService.findAll();
    }

    // Get user by object_id
    @Get(':id')
    findByObjectId(@Param('id') id: string) {
        return this.usersService.findByObjectId(id);
    }

    // Get user by id
    @Get('user_id/:user_id')
    findById(@Param('user_id') user_id: string) {
        return this.usersService.findById(user_id);
    }

    // Get email by email (test successfully)
    @Get('email/:email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @UseGuards(AccessTokenGuard)
    // Delete id by id of object in mongo, must add UseGuards (test successfully)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }


}
