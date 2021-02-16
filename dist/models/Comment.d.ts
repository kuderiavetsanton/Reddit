import { Schema, Document, Model } from 'mongoose';
import { PostDocument } from './Post';
import { VoteDocument } from './Vote';
interface Comment {
    username: string;
    body: string;
    post: Schema.Types.ObjectId | Partial<PostDocument>;
    votes: Schema.Types.ObjectId[] | Partial<VoteDocument>[];
    voteScore: number;
    withUserVote: (username: string) => CommentDocument;
    userVote?: number;
}
interface CommentModel extends Model<CommentDocument> {
    populateThin(postId: string): CommentDocument[];
    populateThinLoged(postId: string, username: string): CommentDocument[];
}
export interface CommentDocument extends Comment, Document {
}
declare const _default: CommentModel;
export default _default;
