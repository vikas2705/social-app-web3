"use client";

import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { useEffect, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Input } from "../components/ui";
import { AUTH_MESSAGE, verifySignature } from "../utils/auth";

interface UserProfile {
	wallet_address: string;
	username: string;
	bio: string;
	profile_pic_url: string;
}

export default function ProfilePage() {
	const { address } = useAccount();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		bio: "",
		profile_pic_url: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { signMessageAsync } = useSignMessage();

	const fileRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);

	const cld = new Cloudinary({
		cloud: {
			cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dasgvuwbk",
		},
	});

	useEffect(() => {
		if (address) {
			fetchProfile();
		}
	}, [address]);

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const fetchProfile = async () => {
		try {
			const response = await fetch(`http://localhost:3001/users/${address}`);
			const data = await response.json();
			setProfile(data);
			setFormData({
				username: data.username || "",
				bio: data.bio || "",
				profile_pic_url: data.profile_pic_url || "",
			});
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	};

	const handleFileUpload = async (file: File) => {
		setFileUploadError(false);
		setUploadingImage(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
			const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dasgvuwbk";

			if (uploadPreset) {
				formData.append("upload_preset", uploadPreset);

				const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
					method: "POST",
					body: formData,
				});

				const data = await response.json();

				if (!response.ok) {
					console.error("Upload error details:", data);
					if (data.error?.message === "Upload preset not found") {
						throw new Error("Upload preset not found. Please create an upload preset in your Cloudinary dashboard.");
					}
					throw new Error(data.error?.message || "Upload failed");
				}

				setFormData((prev) => ({ ...prev, profile_pic_url: data.secure_url }));
			} else {
				formData.append("wallet_address", address || "");

				const response = await fetch("http://localhost:3001/upload/profile-image", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Upload failed via server");
				}

				const data = await response.json();
				setFormData((prev) => ({ ...prev, profile_pic_url: data.secure_url }));
			}

			setFilePerc(100);
			setUploadingImage(false);
		} catch (error: any) {
			console.error("Error uploading image:", error);
			setFileUploadError(true);
			setUploadingImage(false);
			alert(error.message || "Error uploading image");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!address || isLoading) return;

		setError(null);
		setIsLoading(true);
		try {
			const signature = await signMessageAsync({ message: AUTH_MESSAGE });
			await verifySignature(signature, address);

			const response = await fetch(`http://localhost:3001/users/${address}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}

			await fetchProfile();
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
			if (error instanceof Error && error.message === "User rejected the request") {
				setError("You must sign the message to continue");
			} else {
				setError(error instanceof Error ? error.message : "Failed to update profile");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getProfileImage = (url: string) => {
		if (!url) return null;

		try {
			const urlParts = url.split("/");
			const fileName = urlParts[urlParts.length - 1].split(".")[0];

			const img = cld.image(fileName).format("auto").quality("auto").resize(auto().gravity(autoGravity()));

			return img;
		} catch (error) {
			console.error("Error creating Cloudinary image:", error);
			return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white rounded-lg shadow p-6">
					{isEditing ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="flex flex-col items-center mb-4">
								<input
									type="file"
									ref={fileRef}
									hidden
									accept="image/*"
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											setFile(e.target.files[0]);
										}
									}}
								/>
								{formData.profile_pic_url ? (
									<div
										onClick={() => fileRef.current?.click()}
										className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-blue-500 hover:opacity-90 transition">
										{getProfileImage(formData.profile_pic_url) ? (
											<AdvancedImage cldImg={getProfileImage(formData.profile_pic_url)!} className="w-full h-full object-cover" />
										) : (
											<img src={formData.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
										)}
									</div>
								) : (
									<img
										onClick={() => fileRef.current?.click()}
										src="/user.png"
										alt="Profile"
										className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-blue-500 hover:opacity-90 transition"
									/>
								)}
								<p className="text-sm mt-2 text-center">
									{fileUploadError ? (
										<span className="text-red-700">Error uploading image</span>
									) : filePerc > 0 && filePerc < 100 ? (
										<span className="text-blue-700">Uploading...</span>
									) : filePerc === 100 && !fileUploadError ? (
										<span className="text-green-700">Image uploaded successfully!</span>
									) : (
										<span className="text-gray-500">Click to upload profile picture</span>
									)}
								</p>
							</div>

							{error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">{error}</div>}

							<div>
								<Input
									type="text"
									value={formData.username}
									onChange={(e) => setFormData({ ...formData, username: e.target.value })}
									placeholder="Your username"
									maxLength={50}
									label="Username"
								/>
							</div>
							<div>
								<Input
									multiline
									rows={4}
									value={formData.bio}
									onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
									placeholder="Tell us about yourself"
									maxLength={500}
									showCount
									label="Bio"
								/>
							</div>
							<div className="flex justify-end space-x-3">
								<button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
									Cancel
								</button>
								<button
									type="submit"
									disabled={isLoading || uploadingImage}
									className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
									{isLoading ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</form>
					) : (
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								{profile?.profile_pic_url ? (
									<div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
										{getProfileImage(profile.profile_pic_url) ? (
											<AdvancedImage cldImg={getProfileImage(profile.profile_pic_url)!} className="w-full h-full object-cover" />
										) : (
											<img src={profile.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
										)}
									</div>
								) : (
									<img src="/user.png" alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
								)}
								<div>
									<h2 className="text-2xl font-bold text-black">{profile?.username || address?.slice(0, 6) + "..."}</h2>
									<p className="text-gray-500">
										<span className="hidden md:inline">{address}</span>
										<span className="md:hidden">{address?.slice(0, 10)}...</span>
									</p>
								</div>
							</div>
							{profile?.bio && (
								<div>
									<h3 className="text-sm font-medium text-black">Bio</h3>
									<p className="mt-1 text-gray-500">{profile.bio}</p>
								</div>
							)}
							<button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
								Edit Profile
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
