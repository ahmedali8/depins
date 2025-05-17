import { Injectable } from '@nestjs/common';
import { createNewSolanaWallet, decrypt } from 'src/scripts/crypto';
import { User } from '../../../database/tables/user.entity';

// import { decryptSecret, encryptSecret } from 'src/scripts/crypto';

@Injectable()
export class AuthService {
  constructor() {}

  /**
   * Register a new user + Solana wallet.
   */
  async register(): Promise<any> {
    const newWallet = createNewSolanaWallet();

    const user = User.create({
      walletPublicKey: newWallet.publicKey.toString(),
      walletPrivateKey: newWallet.encryptedSecretKey,
    });
    await User.save(user);

    return {
      ...user,
      walletPrivateKey: decrypt(user.walletPrivateKey),
    };
  }

  async getRawSecret(walletPublicKey: string): Promise<string> {
    const { walletPrivateKey } = await User.findOne({
      where: { walletPublicKey },
    });

    const decryptedKey = decrypt(walletPrivateKey);
    return decryptedKey;
  }
}
