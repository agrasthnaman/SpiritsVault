import { Types, Schema, model } from 'mongoose';

/**
 * Interface for a comment on a post
 */
export interface IComment {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
}

/**
 * Interface for a cheer/upvote on a post
 */
export interface ICheer {
  user: Types.ObjectId;
  createdAt: Date;
}

/**
 * Interface for Post data
 */
export interface IPost {
  _id: Types.ObjectId;
  content: string;
  user: Types.ObjectId;
  spirit?: Types.ObjectId;
  images: string[];
  cheers: ICheer[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for comments
 */
const CommentSchema = new Schema<IComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Schema for cheers/upvotes
 */
const CheerSchema = new Schema<ICheer>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Schema definition for Post model
 */
const PostSchema = new Schema<IPost>({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spirit: {
    type: Schema.Types.ObjectId,
    ref: 'Spirit'
  },
  images: [{
    type: String
  }],
  cheers: [CheerSchema],
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Post model for MongoDB
 */
export const Post = model<IPost>('Post', PostSchema); 