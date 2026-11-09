export type LinkCategory =
  | "SOCIAL"
  | "PROJECT"
  | "BLOG"
  | "PORTFOLIO"
  | "CONTACT";

export type LinkIconType = "github" | "mail" | "web";

export interface LinkItem {
  id: string;
  userId?: string;
  title: string;
  url: string;
  description?: string;
  category?: LinkCategory;
  icon?: LinkIconType;
  order?: number;
  isActive: boolean;
  clickCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyLinkProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
  socialLinks: {
    github?: string;
    email?: string;
  };
  links: LinkItem[];
  updatedAt: string;
}

export interface MockApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  meta: {
    totalCount: number;
    activeCount: number;
  };
  data: T;
}

export interface UserProfile {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: LinkItem[];
}
