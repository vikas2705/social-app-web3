import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity, Like, Comment } from '../entities';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.getPost(id);
  }

  @Post()
  async createPost(
    @Body() body: { walletAddress: string; content: string },
  ): Promise<PostEntity> {
    return this.postsService.createPost(body.walletAddress, body.content);
  }

  @Post(':id/like')
  async likePost(
    @Param('id') id: string,
    @Body() body: { walletAddress: string },
  ): Promise<Like | null> {
    return this.postsService.likePost(id, body.walletAddress);
  }

  @Post(':id/comment')
async commentOnPost(
  @Param('id') id: string,
  @Body() body: { walletAddress: string; content: string },
): Promise<any> {
  return this.postsService.commentOnPost(id, body.walletAddress, body.content);
}

}
