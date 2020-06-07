export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
  likeValue: any;
  likesCount: number;
  likeValueBool?: boolean;
}
