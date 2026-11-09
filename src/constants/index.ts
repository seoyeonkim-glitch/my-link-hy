import type {
  LinkItem,
  MockApiResponse,
  MyLinkProfileData,
} from "@/types";

export const SITE_CONFIG = {
  name: "마이링크",
  englishName: "MyLink",
  description: "나만의 링크를 한 곳에서 관리하고 공유하는 서비스",
  url: "https://mylink.example.com",
} as const;

export const STORAGE_KEY = "mylink_profile_data";

export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    userId: "user_seoyeon_01",
    title: "GitHub 프로필",
    url: "https://github.com/seoyeonkim-glitch",
    description: "진행 중인 프로젝트와 잔디를 확인해요",
    category: "SOCIAL",
    icon: "github",
    order: 1,
    isActive: true,
    clickCount: 142,
    createdAt: "2026-11-01T09:00:00.000Z",
    updatedAt: "2026-11-08T12:30:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    userId: "user_seoyeon_01",
    title: "마이링크 (MyLink) 저장소",
    url: "https://github.com/seoyeonkim-glitch/my-link-hy",
    description: "Next.js와 TDS로 만든 나만의 링크 서비스예요",
    category: "PROJECT",
    icon: "github",
    order: 2,
    isActive: true,
    clickCount: 89,
    createdAt: "2026-11-03T14:30:00.000Z",
    updatedAt: "2026-11-09T10:15:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    userId: "user_seoyeon_01",
    title: "기술 블로그 (Velog)",
    url: "https://velog.io/@seoyeonkim-glitch",
    description: "바이브 코딩과 프론트엔드 개발 기록을 남겨요",
    category: "BLOG",
    icon: "web",
    order: 3,
    isActive: true,
    clickCount: 64,
    createdAt: "2026-11-05T18:20:00.000Z",
    updatedAt: "2026-11-06T09:00:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    userId: "user_seoyeon_01",
    title: "포트폴리오 노션",
    url: "https://notion.so/seoyeonkim-portfolio",
    description: "지금까지 만든 웹 프로덕트와 이력을 모았어요",
    category: "PORTFOLIO",
    icon: "web",
    order: 4,
    isActive: true,
    clickCount: 215,
    createdAt: "2026-11-07T11:15:00.000Z",
    updatedAt: "2026-11-09T15:40:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    userId: "user_seoyeon_01",
    title: "이메일로 문의하기",
    url: "mailto:seoyeonkim@hanyang.ac.kr",
    description: "협업이나 커피챗 제안은 언제든 환영해요",
    category: "CONTACT",
    icon: "mail",
    order: 5,
    isActive: false,
    clickCount: 19,
    createdAt: "2026-11-09T20:00:00.000Z",
    updatedAt: "2026-11-09T20:00:00.000Z",
  },
];

export const MOCK_LINKS_RESPONSE: MockApiResponse<LinkItem[]> = {
  status: 200,
  success: true,
  message: "링크 목록을 성공적으로 불러왔어요.",
  meta: {
    totalCount: DUMMY_LINKS.length,
    activeCount: DUMMY_LINKS.filter((item) => item.isActive).length,
  },
  data: DUMMY_LINKS,
};

export const DEFAULT_PROFILE_DATA: MyLinkProfileData = {
  username: "seoyeonkim-glitch",
  displayName: "김서연",
  bio: "바이브 코딩으로 아이디어를 현실로 만드는 대학생 개발자예요. 직관적이고 감각적인 웹 프로덕트를 만들어요.",
  avatarUrl: "https://github.com/seoyeonkim-glitch.png",
  tags: ["💻 바이브 코딩", "🎓 대학생", "🚀 성장 중", "⚡ Next.js"],
  socialLinks: {
    github: "https://github.com/seoyeonkim-glitch",
    email: "seoyeonkim@hanyang.ac.kr",
  },
  links: DUMMY_LINKS,
  updatedAt: "2026-11-09T20:00:00.000Z",
};
