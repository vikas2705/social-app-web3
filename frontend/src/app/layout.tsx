import "@rainbow-me/rainbowkit/styles.css";
import { Inter } from "next/font/google";
import { Navigation } from "./components/Navigation";
import { WalletCheck } from "./components/WalletCheck";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Decentralized Social Media",
	description: "A decentralized social media platform built with Next.js and Ethereum",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<Navigation />
					<WalletCheck>{children}</WalletCheck>
					<Toaster
						position="bottom-right"
						toastOptions={{
							style: {
								height: "70px",
								width: "300px",
								minHeight: "50px",
								maxHeight: "50px",
							},
						}}
					/>
				</Providers>
			</body>
		</html>
	);
}
