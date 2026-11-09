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
    title: "마이링크 (MyLink) 데모",
    url: "https://github.com/seoyeonkim-glitch/my-link-hy",
    description: "Next.js와 shadcn/ui × TDS로 만든 링크 서비스 시연",
    category: "PROJECT",
    icon: "chart",
    badge: {
      text: "HOT",
      variant: "hot",
    },
    actionLabel: "보기",
    order: 1,
    isActive: true,
    clickCount: 215,
    createdAt: "2026-11-01T09:00:00.000Z",
    updatedAt: "2026-11-08T12:30:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    userId: "user_seoyeon_01",
    title: "포트폴리오 노션 문서",
    url: "https://notion.so/seoyeonkim-portfolio",
    description: "상세한 웹 프로덕트 개발 성과와 이력이 담긴 문서입니다.",
    category: "PORTFOLIO",
    icon: "file",
    actionLabel: "다운로드",
    order: 2,
    isActive: true,
    clickCount: 142,
    createdAt: "2026-11-03T14:30:00.000Z",
    updatedAt: "2026-11-09T10:15:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    userId: "user_seoyeon_01",
    title: "GitHub 프로필",
    url: "https://github.com/seoyeonkim-glitch",
    description: "진행 중인 오픈소스 프로젝트와 소스 코드를 확인하세요.",
    category: "SOCIAL",
    icon: "github",
    badge: {
      text: "추천",
      variant: "brand",
    },
    actionLabel: "방문",
    order: 3,
    isActive: true,
    clickCount: 89,
    createdAt: "2026-11-05T18:20:00.000Z",
    updatedAt: "2026-11-06T09:00:00.000Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    userId: "user_seoyeon_01",
    title: "기술 개발 블로그",
    url: "https://velog.io/@seoyeonkim-glitch",
    description: "바이브 코딩과 프론트엔드 트러블슈팅 경험을 기록합니다.",
    category: "BLOG",
    icon: "web",
    badge: {
      text: "NEW",
      variant: "new",
    },
    actionLabel: "읽기",
    order: 4,
    isActive: true,
    clickCount: 64,
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
    actionLabel: "문의",
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
  bio: "사용자 경험을 설계하고 정교하게 구현해요.",
  avatarUrl: "https://github.com/seoyeonkim-glitch.png",
  tags: ["💻 바이브 코딩", "🎓 대학생", "🚀 성장 중", "⚡ Next.js"],
  socialLinks: {
    github: "https://github.com/seoyeonkim-glitch",
    email: "seoyeonkim@hanyang.ac.kr",
    blog: "https://velog.io/@seoyeonkim-glitch",
    portfolio: "https://notion.so/seoyeonkim-portfolio",
  },
  links: DUMMY_LINKS,
  updatedAt: "2026-11-09T21:50:00.000Z",
};
