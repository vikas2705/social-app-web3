import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { User } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async verifyWallet(
  //   signedMessage: string,
  //   walletAddress: string,
  // ): Promise<boolean> {
  //   try {
  //     const message = 'Sign this message to verify your wallet ownership';
  //     const recoveredAddress = ethers.utils.verifyMessage(
  //       message,
  //       signedMessage,
  //     );
  //     return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  //   } catch (error) {
  //     return false;
  //   }
  // }

  async verifyWallet(message: string, signedMessage: string, walletAddress: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signedMessage);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }
  

  async findOrCreateUser(walletAddress: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { wallet_address: walletAddress },
    });

    if (!user) {
      user = this.userRepository.create({
        wallet_address: walletAddress,
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
