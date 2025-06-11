import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, Like, Comment } from '../entities';
import { isUUID } from 'class-validator';
import { UsersService } from '../users/users.service'; 

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    private readonly usersService: UsersService 
  ) {}

  async createPost(walletAddress: string, content: string): Promise<Post> {
    await this.usersService.findByWallet(walletAddress); 
    const post = this.postRepo.create({
      wallet_address: walletAddress,
      content,
      user: { wallet_address: walletAddress }, 
      timestamp: new Date(),
    });
    return this.postRepo.save(post);
  }

  // async getPosts(): Promise<Post[]> {
  //   return this.postRepo.find({
  //     relations: ['user', 'likes', 'comments'],
  //     order: { timestamp: 'DESC' },
  //   });
  // }

  async getPosts(): Promise<any[]> {
    const posts = await this.postRepo.find({
      relations: ['user', 'likes', 'comments', 'comments.user'],
      order: { timestamp: 'DESC' },
    });
  
    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      wallet_address: post.wallet_address,
      timestamp: post.timestamp,
      user: post.user
        ? {
            wallet_address: post.user.wallet_address,
            username: post.user.username,
            bio: post.user.bio,
            profile_pic_url: post.user.profile_pic_url,
          }
        : null,
      likes: post.likes,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        wallet_address: comment.wallet_address,
        content: comment.content,
        timestamp: comment.timestamp,
        commentedBy: comment.user
          ? {
              wallet_address: comment.user.wallet_address,
              username: comment.user.username,
              bio: comment.user.bio,
              profile_pic_url: comment.user.profile_pic_url,
            }
          : null,
      })),
    }));
  }
  
  
  
  

  async getPost(id: string): Promise<Post> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid post ID format');
    }
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async likePost(postId: string, walletAddress: string): Promise<Like | null> {
    if (!isUUID(postId)) {
      throw new BadRequestException('Invalid post ID format');
    }
  
    const post = await this.getPost(postId);
    await this.usersService.findByWallet(walletAddress);
  
    const existingLike = await this.likeRepo.findOne({
      where: {
        post_id: postId,
        wallet_address: walletAddress,
      },
    });
  
    if (existingLike) {
      await this.likeRepo.remove(existingLike); // Unlike
      return null;
    }
  
    const newLike = this.likeRepo.create({
      post_id: post.id,
      wallet_address: walletAddress,
      post,
    });
  
    return this.likeRepo.save(newLike); // Like
  }
  
  
  
  // async commentOnPost(postId: string, walletAddress: string, content: string): Promise<Comment> {
  //   if (!isUUID(postId)) {
  //     throw new BadRequestException('Invalid post ID format');
  //   }
  //   const post = await this.getPost(postId);
  //   const user = await this.usersService.findByWallet(walletAddress); 
  //   const comment = this.commentRepo.create({
  //     post,
  //     wallet_address: walletAddress,
  //     content,
  //   });

  //   return this.commentRepo.save(comment);
  // }

  async commentOnPost(postId: string, walletAddress: string, content: string) {
  if (!isUUID(postId)) {
    throw new BadRequestException('Invalid post ID format');
  }

  const post = await this.getPost(postId);
  const user = await this.usersService.findByWallet(walletAddress);

  const comment = this.commentRepo.create({
    post,
    wallet_address: walletAddress,
    content,
    timestamp: new Date(),
    user,
  });

  const savedComment = await this.commentRepo.save(comment);

  const comments = await this.commentRepo.find({
    where: { post: { id: postId } },
    order: { timestamp: 'ASC' },
  });

  // Fetch all users for those comments
  const allUsers = await this.usersService.findByWallets(
    comments.map(c => c.wallet_address),
  );

  const commentsWithUser = comments.map(c => {
    const commentedBy = allUsers.find(u => u.wallet_address === c.wallet_address);
    return {
      ...c,
      commentedBy: {
        wallet_address: commentedBy?.wallet_address,
        username: commentedBy?.username,
        bio: commentedBy?.bio,
        profile_pic_url: commentedBy?.profile_pic_url,
      },
    };
  });

  return {
    id: savedComment.id,
    wallet_address: walletAddress,
    content: savedComment.content,
    timestamp: savedComment.timestamp,
    post: {
      id: post.id,
      content: post.content,
      wallet_address: post.wallet_address,
      timestamp: post.timestamp,
      user: {
        wallet_address: post.user.wallet_address,
        username: post.user.username,
        bio: post.user.bio,
        profile_pic_url: post.user.profile_pic_url,
      },
      likes: post.likes,
      comments: commentsWithUser,
    },
  };
}

  
}
