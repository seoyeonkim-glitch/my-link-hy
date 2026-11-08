export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: LinkItem[];
}
