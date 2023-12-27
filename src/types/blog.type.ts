declare interface BlogType {
  id: string;
  title: string;
  excerpt: string;
  sections: Section[];
  date: Date;
}

export interface Section {
  header: string;
  content: string;
  images?: ImageType[];
}

export interface ImageType {
  url: string;
  alt: string;
}

export default BlogType;
