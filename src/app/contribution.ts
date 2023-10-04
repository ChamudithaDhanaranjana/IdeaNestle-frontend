import { Post } from "./post";

export interface Contribution {
    id: string; 
  content: string; 
  contributorId: string;
  postId: Post;
  username:string;
}
