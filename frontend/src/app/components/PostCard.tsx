/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { useSignMessage } from "wagmi";
import { AUTH_MESSAGE, verifySignature } from "../utils/auth";
import { Input } from "./ui";

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

interface PostCardProps {
	post: Post;
	currentUser: string | undefined;
	onInteraction: () => void;
}

export function PostCard({ post, currentUser, onInteraction }: PostCardProps) {
	const [isLiking, setIsLiking] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);
	const [comment, setComment] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { signMessageAsync } = useSignMessage();

	const handleLike = async () => {
		if (!currentUser || isLiking) return;

		setError(null);
		setIsLiking(true);
		try {
			const signature = await signMessageAsync({ message: AUTH_MESSAGE });
			await verifySignature(signature, currentUser);

			const response = await fetch(`http://localhost:3001/posts/${post.id}/like`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					walletAddress: currentUser,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to like post");
			}

			onInteraction();
		} catch (error) {
			console.error("Error liking post:", error);
			if (error instanceof Error && error.message === "User rejected the request") {
				setError("You must sign the message to continue");
			} else {
				setError(error instanceof Error ? error.message : "Failed to like post");
			}
		} finally {
			setIsLiking(false);
		}
	};

	const handleComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentUser || !comment.trim() || isCommenting) return;

		setError(null);
		setIsCommenting(true);
		try {
			const signature = await signMessageAsync({ message: AUTH_MESSAGE });
			await verifySignature(signature, currentUser);

			const response = await fetch(`http://localhost:3001/posts/${post.id}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					walletAddress: currentUser,
					content: comment.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to add comment");
			}

			setComment("");
			onInteraction();
		} catch (error) {
			console.error("Error commenting on post:", error);
			if (error instanceof Error && error.message === "User rejected the request") {
				setError("You must sign the message to continue");
			} else {
				setError(error instanceof Error ? error.message : "Failed to add comment");
			}
		} finally {
			setIsCommenting(false);
		}
	};

	const hasLiked = post.likes.some((like) => like.wallet_address === currentUser);

	return (
		<div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-5 border border-gray-100 transition-all duration-300 hover:shadow-lg">
			<div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
				<div className="relative">
					<Image
						src={post?.user?.profile_pic_url || "/user.png"}
						alt="Profile"
						width={40}
						height={40}
						className="rounded-full border-2 border-gray-100 object-cover w-10 h-10 sm:w-12 sm:h-12"
					/>
					<div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
				</div>

				<div className="flex-1 w-full">
					<div className="w-full">
						<div className="flex items-center justify-between w-full">
							<div className="min-w-0 max-w-full">
								<span className="font-semibold text-gray-800 hover:underline cursor-pointer text-sm sm:text-base truncate block text-left">
									{post?.user?.username || post.wallet_address.slice(0, 6) + "..."}
								</span>
								<div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 flex items-center flex-wrap">
									<span>
										{new Date(post.timestamp).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
									<span className="mx-1.5">•</span>
									<span className="italic">Web3 Verified</span>
								</div>
							</div>
						</div>

						<div
							className="mt-2 sm:mt-2.5 text-gray-700 leading-relaxed text-sm sm:text-base break-words text-left w-full"
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>

						{error && <div className="mt-2 text-xs sm:text-sm text-red-500">{error}</div>}

						<div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
							<div className="flex items-center space-x-3 sm:space-x-5">
								<button
									onClick={handleLike}
									disabled={isLiking}
									className={`group flex items-center space-x-1 sm:space-x-2 transition-colors duration-200 ${
										hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
									}`}>
									{hasLiked ? (
										<HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-200" />
									) : (
										<HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-200" />
									)}
									<span className="text-xs sm:text-sm font-medium">{post.likes.length}</span>
								</button>

								<button className="group flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
									<ChatBubbleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform duration-200" />
									<span className="text-xs sm:text-sm font-medium">{post.comments.length}</span>
								</button>
							</div>

							<div className="text-[10px] sm:text-xs text-gray-400">
								{post.comments.length > 0 && `${post.comments.length} ${post.comments.length === 1 ? "comment" : "comments"}`}
							</div>
						</div>

						{currentUser && (
							<form onSubmit={handleComment} className="mt-3 sm:mt-4">
								<div className="relative">
									<Input
										type="text"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder="Write a comment..."
										className="pr-16 sm:pr-20 text-sm"
										containerClassName="w-full"
									/>
									<button
										type="submit"
										disabled={isCommenting || !comment.trim()}
										className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
										{isCommenting ? "Sending..." : "Send"}
									</button>
								</div>
							</form>
						)}

						{post.comments.length > 0 && (
							<div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-1">
								{post.comments.map(
									(comment) => (
										console.log(comment, "comment"),
										(
											<div
												key={comment.id}
												className="bg-gray-50 rounded-xl p-2.5 sm:p-3.5 border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200 w-full">
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center space-x-1.5 sm:space-x-2">
														<div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
															<Image
																src={comment?.commentedBy?.profile_pic_url || "/user.png"}
																alt={`Profile picture of ${comment.commentedBy?.username || "user"}`}
																width={20}
																height={20}
																className="rounded-full object-cover w-5 h-5 sm:w-6 sm:h-6"
															/>
														</div>
														<span className="font-medium text-xs sm:text-sm text-gray-800 truncate">
															{comment?.commentedBy?.username || comment.wallet_address.slice(0, 6) + "..."}
														</span>
													</div>
													<span className="text-[10px] sm:text-xs text-gray-400">
														{new Date(comment.timestamp).toLocaleDateString(undefined, {
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														})}
													</span>
												</div>
												<p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-700 break-words text-left">{comment.content}</p>
											</div>
										)
									)
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
