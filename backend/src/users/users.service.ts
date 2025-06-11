import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByWallet(walletAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { wallet_address: walletAddress },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    walletAddress: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.findByWallet(walletAddress);

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async createUser(wallet_address: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { wallet_address: wallet_address },
    });
    if (user) {
        throw new BadRequestException('User already exists');
      }
    const newUser = this.userRepository.create({ wallet_address });
    return this.userRepository.save(newUser);
  }

  // async findByWallets(wallets: string[]): Promise<User[]> {
  //   return this.userRepository.find({
  //     where: {
  //       wallet_address: In(wallets),
  //     },
  //   });
  // }

  async findByWallets(walletAddresses: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: walletAddresses.map(address => ({ wallet_address: address })),
    });
  }
  
}
