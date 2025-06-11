"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";

export function Navigation() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	return (
		<nav className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
							<span className="sr-only">Open main menu</span>
							<svg
								className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
							<svg
								className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Desktop menu */}
					<div className="hidden md:flex md:space-x-8">
						<Link
							href="/"
							className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
								pathname === "/" ? "border-blue-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
							}`}>
							Home
						</Link>
						<Link
							href="/profile"
							className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
								pathname === "/profile"
									? "border-blue-500 text-gray-900"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
							}`}>
							Profile
						</Link>
					</div>

					<div className="flex items-center">
						<ConnectButton />
					</div>
				</div>

				<div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
					<div className="pt-2 pb-3 space-y-1">
						<Link
							href="/"
							className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								pathname === "/"
									? "border-blue-500 text-blue-700 bg-blue-50"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							}`}>
							Home
						</Link>
						<Link
							href="/profile"
							className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								pathname === "/profile"
									? "border-blue-500 text-blue-700 bg-blue-50"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							}`}>
							Profile
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
