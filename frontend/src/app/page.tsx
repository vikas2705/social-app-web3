/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { PostCard } from "./components/PostCard";
import CreatePost from "./components/CreatePost";

interface Post {
	id: number;
	content: string;
	wallet_address: string;
	timestamp: string;
	likes: any[];
	comments: any[];
	user: {
		username: string;
		profile_pic_url: string;
	};
}

export default function Home() {
	const { address, isConnected } = useAccount();
	const [posts, setPosts] = useState<Post[]>([]);

	const fetchPosts = async () => {
		try {
			const response = await fetch("http://localhost:3001/posts");
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	useEffect(() => {
		fetchPosts();
		console.log(address);
	}, []);

	const createUser = async () => {
		const response = await fetch(`http://localhost:3001/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ wallet_address: address }),
		});
		const data = await response.json();
		console.log(data);
	};

	useEffect(() => {
		if (isConnected && address) {
			createUser();
		}
	}, [isConnected, address]);

	return (
		<main className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{isConnected && (
					<>
						<CreatePost onPostCreated={fetchPosts} />
						<div className="w-full border-b-4 border-gray-300 h-2 mt-5"></div>
					</>
				)}
				<div className="mt-8 space-y-6">
					{posts.length === 0 ? (
						<p className="text-xl text-gray-600">No posts yet. Be the first to share your thoughts!</p>
					) : (
						<div className="text-center py-8 space-y-6">
							{posts.map((post) => (
								<PostCard key={post.id} post={post} currentUser={address} onInteraction={fetchPosts} />
							))}
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
