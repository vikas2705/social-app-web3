"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { AUTH_MESSAGE, verifySignature } from "../utils/auth";
import toast from "react-hot-toast";
import RichEditor from "./RichEditor";

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({
  onPostCreated = () => {},
}: Partial<CreatePostProps>) {
  const { address } = useAccount();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signMessageAsync } = useSignMessage();

  console.log(typeof content, "content");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsLoading(true);
    try {
      const signature = await signMessageAsync({ message: AUTH_MESSAGE });
      await verifySignature(signature, address);

      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          content: content,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      setContent("");
      onPostCreated();
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      if (
        error instanceof Error &&
        error.message === "User rejected the request"
      ) {
        toast.error("You must sign the message to continue");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to create post"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black">
          What&apos;s on your mind?
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* <Input
					multiline
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Share your thoughts..."
					maxLength={280}
					className="resize-none h-32 mb-4"
					showCount
					rows={6}
				/> */}
        <RichEditor value={content} onChange={setContent} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
