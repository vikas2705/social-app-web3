import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })  
  user: User;

  @Column()
  wallet_address: string;

  @Column({ length: 280 })
  content: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
