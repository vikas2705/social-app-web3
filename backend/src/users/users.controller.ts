import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet')
  async getUserProfile(@Param('wallet') walletAddress: string): Promise<User> {
    return this.usersService.findByWallet(walletAddress);
  }

  @Patch(':wallet')
  async updateUserProfile(
    @Param('wallet') walletAddress: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.updateProfile(walletAddress, updateData);
  }

  @Post()
  async createUser(@Body() body: { wallet_address: string }): Promise<User> {
    return this.usersService.createUser(body.wallet_address);
  }
}
