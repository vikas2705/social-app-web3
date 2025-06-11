import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('verify')
  // async verifyWallet(
  //   @Body() body: { signedMessage: string; walletAddress: string },
  // ) {
  //   const isValid = await this.authService.verifyWallet(
  //     body.signedMessage,
  //     body.walletAddress,
  //   );

  //   if (isValid) {
  //     const user = await this.authService.findOrCreateUser(body.walletAddress);
  //     return { success: true, user };
  //   }

  //   return { success: false, message: 'Invalid signature' };
  // }

  @Post('verify')
async verifyWallet(
  @Body() body: { message: string; signedMessage: string; walletAddress: string },
) {
  const isValid = await this.authService.verifyWallet(
    body.message,
    body.signedMessage,
    body.walletAddress,
  );

  if (isValid) {
    const user = await this.authService.findOrCreateUser(body.walletAddress);
    return { success: true, user };
  }

  return { success: false, message: 'Invalid signature' };
}

}
