import { Schema, Document, Model } from 'mongoose';
import { CommentDocument } from './Comment';
import { SubDocument } from './Sub';
import { UserDocument } from './User';
import { VoteDocument } from './Vote';
interface Post {
    slug: string;
    author: Schema.Types.ObjectId | Partial<UserDocument>;
    title: string;
    body: string;
    sub: Schema.Types.ObjectId | Partial<SubDocument>;
    comments: Schema.Types.ObjectId[] | Partial<CommentDocument>[];
    url?: string;
    votes: Schema.Types.ObjectId[] | Partial<VoteDocument>[];
    voteScore?: number;
    commentsAmount?: number;
    withUserVote: (username: string) => PostDocument;
    userVote: number;
    createdAt: Date;
}
export interface PostDocument extends Document, Post {
}
interface PostModel extends Model<PostDocument> {
    populateThin(page: number, condition?: any): PostDocument[];
    populateThinLoged(username: string, page: number, condition?: any): PostDocument[];
}
declare const _default: PostModel;
export default _default;
