/**
 * Authenticates a user by verifying a signed message with the backend
 *
 * @param signature - The signature obtained from the wallet
 * @param walletAddress - The current user's wallet address
 * @returns Promise that resolves when authentication is successful
 */

/**
 * Standard authentication message used across the application
 */
export const AUTH_MESSAGE = "Sign this message to verify your wallet ownership";

export async function verifySignature(
  signature: string,
  walletAddress: string
): Promise<boolean> {
  if (!walletAddress) {
    throw new Error("Not logged in");
  }

  try {
    const response = await fetch("http://localhost:3001/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: AUTH_MESSAGE,
        signedMessage: signature,
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    return true;
  } catch (error) {
    throw error;
  }
}
