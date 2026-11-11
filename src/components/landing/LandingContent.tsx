"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Code2,
  EyeOff,
  Globe,
  GraduationCap,
  Link2,
  Loader2,
  MousePointerClick,
  Palette,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardListRow,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/profile/ProfileHeader";
import { cn } from "@/lib/utils";
import type { LinkItem } from "@/types";

export interface LandingPublicProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
}

export interface LandingContentProps {
  publicProfile?: LandingPublicProfile;
  publicLinks: LinkItem[];
  isPublicLoading?: boolean;
  isAuthActionLoading?: boolean;
  isLoggedInPreview?: boolean;
  onGoogleLogin: () => void;
  onExitPreview?: () => void;
  onTrackPublicLinkClick: (linkId: string) => void;
}

type PersonaKey = "developer" | "designer" | "student";

interface DemoLinkItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeVariant?: "hot" | "brand" | "new";
  initialClicks: number;
}

interface PersonaPreset {
  key: PersonaKey;
  label: string;
  defaultName: string;
  defaultHandle: string;
  roleBadge: string;
  bio: string;
  avatarBgClass: string;
  avatarTextClass: string;
  initialText: string;
  links: DemoLinkItem[];
}

// 인터랙티브 체험 카드용 페르소나 프리셋
const PERSONA_PRESETS: Record<PersonaKey, PersonaPreset> = {
  developer: {
    key: "developer",
    label: "개발자",
    defaultName: "김서연",
    defaultHandle: "seoyeon",
    roleBadge: "프론트엔드",
    bio: "사용자 경험을 설계하고 정교하게 구현해요.",
    avatarBgClass: "bg-[#E8F3FF]",
    avatarTextClass: "text-[#3182F6]",
    initialText: "DEV",
    links: [
      {
        id: "dev-github",
        title: "GitHub 오픈소스 저장소",
        subtitle: "진행 중인 Next.js 프로젝트와 커밋 로그",
        badgeText: "HOT",
        badgeVariant: "hot",
        initialClicks: 24,
      },
      {
        id: "dev-blog",
        title: "프론트엔드 기술 블로그",
        subtitle: "트러블슈팅과 아키텍처 회고 기록",
        badgeText: "추천",
        badgeVariant: "brand",
        initialClicks: 16,
      },
      {
        id: "dev-portfolio",
        title: "포트폴리오 노션 문서",
        subtitle: "주요 프로덕트 개발 성과 한눈에 보기",
        initialClicks: 11,
      },
    ],
  },
  designer: {
    key: "designer",
    label: "디자이너",
    defaultName: "박지우",
    defaultHandle: "jiwoo_ux",
    roleBadge: "프로덕트 디자인",
    bio: "작은 인터랙션 하나도 이유 있게 설계해요.",
    avatarBgClass: "bg-[#FFF0F6]",
    avatarTextClass: "text-[#E11D48]",
    initialText: "UX",
    links: [
      {
        id: "des-case",
        title: "모바일 앱 UX 리뉴얼 사례",
        subtitle: "전환율 34% 개선한 디자인 시스템 여정",
        badgeText: "NEW",
        badgeVariant: "new",
        initialClicks: 31,
      },
      {
        id: "des-figma",
        title: "Figma UI 키트 공유",
        subtitle: "실무에서 바로 쓰는 컴포넌트 라이브러리",
        badgeText: "추천",
        badgeVariant: "brand",
        initialClicks: 19,
      },
      {
        id: "des-coffee",
        title: "디자인 커피챗 신청하기",
        subtitle: "포트폴리오 피드백·협업 문의 환영해요",
        initialClicks: 8,
      },
    ],
  },
  student: {
    key: "student",
    label: "대학생",
    defaultName: "한양인",
    defaultHandle: "hy_maker",
    roleBadge: "바이브 코딩",
    bio: "아이디어를 빠르게 서비스로 만들고 공유해요.",
    avatarBgClass: "bg-[#E8F8F0]",
    avatarTextClass: "text-[#15803D]",
    initialText: "HY",
    links: [
      {
        id: "stu-demo",
        title: "이번 학기 팀 프로젝트 데모",
        subtitle: "실제 배포된 웹 서비스 바로 체험하기",
        badgeText: "HOT",
        badgeVariant: "hot",
        initialClicks: 28,
      },
      {
        id: "stu-club",
        title: "교내 IT 동아리 모집 안내",
        subtitle: "함께 만들고 성장할 신입 부원을 찾아요",
        badgeText: "NEW",
        badgeVariant: "new",
        initialClicks: 15,
      },
      {
        id: "stu-resume",
        title: "자기소개 & 이력서 링크",
        subtitle: "인턴십 지원용 경력·활동 요약 페이지",
        initialClicks: 9,
      },
    ],
  },
};

// 인라인 style 없이 막대 너비를 표현하기 위한 Tailwind 유틸리티 클래스 매핑
const PROGRESS_WIDTH_CLASSES: Record<number, string> = {
  0: "w-0",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-[20%]",
  25: "w-[25%]",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-[40%]",
  45: "w-[45%]",
  50: "w-[50%]",
  55: "w-[55%]",
  60: "w-[60%]",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-[75%]",
  80: "w-[80%]",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-full",
};

function getProgressWidthClass(percent: number): string {
  if (percent <= 0) return "w-0";
  const snapped = Math.min(100, Math.max(5, Math.round(percent / 5) * 5));
  return PROGRESS_WIDTH_CLASSES[snapped] ?? "w-0";
}

const FAQ_ITEMS = [
  {
    question: "정말 무료로 내 링크 페이지를 만들 수 있나요?",
    answer:
      "네, 100% 무료예요. 별도 요금제나 링크 개수 제한 없이 원하는 만큼 링크를 추가하고 수정할 수 있어요.",
  },
  {
    question: "내 개인 페이지 주소(/아이디)는 어떻게 정해지나요?",
    answer:
      "Google 계정으로 로그인하면 이메일 아이디 앞부분을 바탕으로 개인 페이지 주소가 자동으로 만들어져요. 상단 마이페이지 버튼을 누르면 바로 이동할 수 있어요.",
  },
  {
    question: "방문자도 링크 클릭수를 볼 수 있나요?",
    answer:
      "아니요! 방문자가 보는 공개 페이지에서는 클릭수가 깔끔하게 숨겨져 있어요. 클릭수 요약과 인기 순위 차트(/stats)는 로그인한 본인만 확인할 수 있어요.",
  },
  {
    question: "모바일이나 태블릿에서도 깔끔하게 보이나요?",
    answer:
      "네, 스마트폰부터 태블릿, 데스크톱 화면까지 모든 해상도에 맞춰 카드와 버튼 크기가 자동으로 최적화돼요.",
  },
] as const;

const STEP_ITEMS = [
  {
    step: "STEP 01",
    title: "Google로 3초 로그인",
    description: "복잡한 회원가입 없이 구글 계정 한 번으로 바로 시작해요.",
  },
  {
    step: "STEP 02",
    title: "내 링크 차곡차곡 추가",
    description: "깃허브, 블로그, 노션 포트폴리오 주소를 원하는 대로 담아요.",
  },
  {
    step: "STEP 03",
    title: "공유하고 반응 확인하기",
    description: "내 전용 주소를 공유하고 /stats에서 클릭 통계를 확인해요.",
  },
] as const;

export function LandingContent({
  publicProfile,
  publicLinks,
  isPublicLoading = false,
  isAuthActionLoading = false,
  isLoggedInPreview = false,
  onGoogleLogin,
  onExitPreview,
  onTrackPublicLinkClick,
}: LandingContentProps) {
  const [activePersona, setActivePersona] = useState<PersonaKey>("developer");
  const [customHandle, setCustomHandle] = useState("");
  const [demoExtraClicks, setDemoExtraClicks] = useState<Record<string, number>>(
    {}
  );
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const persona = PERSONA_PRESETS[activePersona];
  const sanitizedHandle = customHandle.trim().replace(/\s+/g, "-");
  const previewName = sanitizedHandle || persona.defaultName;
  const previewHandle = sanitizedHandle || persona.defaultHandle;

  const previewLinksWithCounts = persona.links.map((item) => {
    const added = demoExtraClicks[item.id] ?? 0;
    return {
      ...item,
      clicks: item.initialClicks + added,
      added,
    };
  });

  const totalDemoClicks = previewLinksWithCounts.reduce(
    (sum, item) => sum + item.clicks,
    0
  );
  const topDemoLink = previewLinksWithCounts.reduce((best, current) =>
    current.clicks > best.clicks ? current : best
  );
  const totalAddedByUser = Object.values(demoExtraClicks).reduce(
    (sum, val) => sum + val,
    0
  );

  const handleDemoLinkClick = (id: string) => {
    setDemoExtraClicks((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
    setLastClickedId(id);
  };

  const handleResetDemoClicks = () => {
    setDemoExtraClicks({});
    setLastClickedId(null);
  };

  const hasPublicShowcase =
    Boolean(publicProfile) && publicProfile?.uid !== "anonymous";
  const featuredPublicLinks = publicLinks.slice(0, 3);
  const publicProfileHref = hasPublicShowcase && publicProfile
    ? `/${encodeURIComponent(publicProfile.displayName)}`
    : "/";

  return (
    <main role="main" className="w-full max-w-[860px] flex flex-col gap-5">
      {/* 로그인 상태에서 랜딩 페이지를 미리 보는 경우 안내 바 표시 */}
      {isLoggedInPreview && onExitPreview && (
        <div className="rounded-[18px] bg-[#E8F3FF] border border-[#3182F6]/25 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#191F28]">
            <Sparkles
              className="w-4 h-4 text-[#3182F6] shrink-0"
              aria-hidden="true"
            />
            <span>
              현재 랜딩 페이지 화면을 미리 보고 있어요. 언제든 내 링크 관리로 돌아갈 수 있어요.
            </span>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onExitPreview}
            className="h-8 rounded-full px-3.5 text-[12px] font-bold shrink-0 self-start sm:self-auto"
          >
            내 링크 관리로 돌아가기
          </Button>
        </div>
      )}

      {/* ── 1. 히어로 + 인터랙티브 미니 MyLink 체험 카드 (반응형 2단 그리드) ── */}
      <section
        aria-label="마이링크 서비스 소개"
        className="grid grid-cols-1 md:grid-cols-[1.06fr_0.94fr] gap-5 items-stretch"
      >
        {/* 좌측: 핵심 카피 + 내 주소 미리 만들기 + Primary CTA */}
        <Card className="p-5 sm:p-7 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Badge
              variant="brand"
              className="h-7 px-3 text-[12px] w-fit gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              10초 만에 완성하는 나만의 링크 허브
            </Badge>

            <h1 className="text-[26px] sm:text-[32px] font-extrabold leading-[1.24] tracking-[-0.025em] text-[#191F28] break-keep">
              흩어진 내 링크를
              <br />
              <span className="text-[#3182F6]">하나의 카드</span>로 모아요
            </h1>

            <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#4E5968] break-keep">
              포트폴리오, GitHub, 블로그, 연락처까지.
              <br className="hidden sm:inline" /> 복잡한 설정 없이 Google 로그인
              한 번으로 깔끔한 내 페이지와 클릭 통계를 받아보세요.
            </p>

            {/* 재미 요소 1: 내 주소 미리 입력해 보기 (오른쪽 체험 카드에 실시간 반영) */}
            <div className="rounded-[18px] bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="landing-handle-input"
                  className="text-[12px] font-bold text-[#4E5968]"
                >
                  내 페이지 이름 미리 써보기
                </label>
                <span className="text-[11px] font-semibold text-[#3182F6]">
                  오른쪽 카드에 바로 반영돼요
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-[12px] bg-white border border-[#E5E8EB] focus-within:border-[#3182F6] focus-within:ring-2 focus-within:ring-[#3182F6]/20 px-3 h-11 transition-all">
                <span className="text-[13px] font-semibold text-[#8B95A1] shrink-0 select-none">
                  mylink /
                </span>
                <input
                  id="landing-handle-input"
                  type="text"
                  maxLength={20}
                  value={customHandle}
                  onChange={(event) => setCustomHandle(event.target.value)}
                  placeholder={persona.defaultHandle}
                  aria-label="미리보기 페이지 아이디 입력"
                  className="w-full bg-transparent text-[14px] font-bold text-[#191F28] placeholder:text-[#B0B8C1] placeholder:font-medium focus:outline-none min-w-0"
                />
                {customHandle && (
                  <button
                    type="button"
                    onClick={() => setCustomHandle("")}
                    className="text-[11px] font-semibold text-[#8B95A1] hover:text-[#191F28] shrink-0 cursor-pointer"
                  >
                    지우기
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CTA & 핵심 장점 요약 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {isLoggedInPreview && onExitPreview ? (
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={onExitPreview}
                  className="h-12 rounded-[14px] px-5 text-[15px] font-bold gap-2 w-full sm:w-auto"
                >
                  내 링크 관리로 이동하기
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  disabled={isAuthActionLoading}
                  onClick={onGoogleLogin}
                  className="h-12 rounded-[14px] px-5 text-[15px] font-bold gap-2 w-full sm:w-auto"
                >
                  {isAuthActionLoading ? (
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                        <GoogleIcon className="w-3.5 h-3.5" />
                      </span>
                      Google로 무료 시작하기
                    </>
                  )}
                </Button>
              )}

              <Link
                href={hasPublicShowcase ? publicProfileHref : "#playground"}
                className="w-full sm:w-auto"
              >
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  tabIndex={-1}
                  className="h-12 rounded-[14px] px-4 text-[14px] font-bold text-[#4E5968] hover:text-[#191F28] w-full gap-1.5"
                >
                  {hasPublicShowcase ? "실제 페이지 구경하기" : "체험 카드 눌러보기"}
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-[#6B7684]">
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#3182F6]" aria-hidden="true" />
                가입 없이 10초 생성
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#3182F6]" aria-hidden="true" />
                실시간 클릭 통계
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#3182F6]" aria-hidden="true" />
                무료 무제한 링크
              </span>
            </div>
          </div>
        </Card>

        {/* 우측: 재미 요소 2 — 직접 눌러보는 인터랙티브 미니 MyLink 카드 */}
        <Card id="playground" className="p-5 sm:p-6 flex flex-col gap-3.5">
          {/* 상단 라이브 체험 헤더 & 페르소나 전환 탭 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-[#34C759]"
                aria-hidden="true"
              />
              <span className="text-[12px] font-bold text-[#191F28]">
                미리 눌러보는 내 카드
              </span>
            </div>

            <div
              role="tablist"
              aria-label="체험 페르소나 선택"
              className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[#F2F4F6] p-1 max-w-full"
            >
              {(["developer", "designer", "student"] as const).map((key) => {
                const item = PERSONA_PRESETS[key];
                const isSelected = activePersona === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setActivePersona(key);
                      setLastClickedId(null);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold transition-all cursor-pointer",
                      isSelected
                        ? "bg-white text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                        : "text-[#6B7684] hover:text-[#191F28]"
                    )}
                  >
                    {key === "developer" && (
                      <Code2 className="w-3 h-3" aria-hidden="true" />
                    )}
                    {key === "designer" && (
                      <Palette className="w-3 h-3" aria-hidden="true" />
                    )}
                    {key === "student" && (
                      <GraduationCap className="w-3 h-3" aria-hidden="true" />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 미니 프로필 카드 요약 */}
          <div className="rounded-[18px] bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold shrink-0 border border-white shadow-[0_1px_2px_rgba(25,31,40,0.06)]",
                persona.avatarBgClass,
                persona.avatarTextClass
              )}
              aria-hidden="true"
            >
              {sanitizedHandle
                ? sanitizedHandle.slice(0, 2).toUpperCase()
                : persona.initialText}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[15px] font-bold text-[#191F28] truncate">
                  {previewName}
                </p>
                <Badge variant="brand">{persona.roleBadge}</Badge>
              </div>
              <p className="text-[11.5px] font-medium text-[#8B95A1] truncate">
                /{previewHandle} · {persona.bio}
              </p>
            </div>
          </div>

          {/* 클릭 가능한 샘플 링크 리스트 (클릭 시 숫자 증가 체험) */}
          <div className="flex items-center justify-between gap-2 px-0.5">
            <p className="text-[12px] font-semibold text-[#6B7684]">
              아래 링크를 눌러 클릭수 변화를 체험해 보세요 👇
            </p>
            {totalAddedByUser > 0 && (
              <button
                type="button"
                onClick={handleResetDemoClicks}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8B95A1] hover:text-[#191F28] cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                초기화
              </button>
            )}
          </div>

          <ul role="list" className="flex flex-col gap-2">
            {previewLinksWithCounts.map((item) => {
              const isJustClicked = lastClickedId === item.id;
              return (
                <li key={item.id} role="listitem">
                  <button
                    type="button"
                    onClick={() => handleDemoLinkClick(item.id)}
                    className="w-full text-left rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40 cursor-pointer"
                  >
                    <CardListRow
                      className={cn(
                        "p-3 sm:p-3 justify-between rounded-[14px]",
                        isJustClicked &&
                          "border-[#3182F6]/40 bg-[#E8F3FF]/45 hover:bg-[#E8F3FF]/60"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13.5px] font-bold text-[#191F28] truncate">
                            {item.title}
                          </span>
                          {item.badgeText && (
                            <Badge variant={item.badgeVariant ?? "brand"}>
                              {item.badgeText}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11.5px] text-[#6B7684] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isJustClicked && (
                          <span className="text-[10.5px] font-extrabold text-[#3182F6] bg-white px-1.5 py-0.5 rounded-full border border-[#3182F6]/20">
                            +1
                          </span>
                        )}
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-[22px] px-2 text-[11px] font-bold gap-1 tabular-nums",
                            isJustClicked
                              ? "bg-[#3182F6] text-white"
                              : "bg-white text-[#4E5968] border border-[#E5E8EB]"
                          )}
                        >
                          <MousePointerClick
                            className={cn(
                              "w-3 h-3",
                              isJustClicked ? "text-white" : "text-[#3182F6]"
                            )}
                            aria-hidden="true"
                          />
                          {item.clicks}
                        </Badge>
                      </div>
                    </CardListRow>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 미니 실시간 통계 요약 바 */}
          <div className="mt-auto rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 text-[11.5px]">
              <span className="inline-flex items-center gap-1 min-w-0 font-bold text-[#4E5968]">
                <BarChart3
                  className="w-3.5 h-3.5 text-[#3182F6] shrink-0"
                  aria-hidden="true"
                />
                <span className="shrink-0">실시간 1위:</span>
                <span className="text-[#191F28] truncate">
                  {topDemoLink.title}
                </span>
              </span>
              <span className="font-extrabold text-[#3182F6] tabular-nums shrink-0">
                총 {totalDemoClicks}회
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-[#E5E8EB] overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full bg-[#3182F6] transition-all duration-300",
                  getProgressWidthClass(
                    totalDemoClicks > 0
                      ? Math.round((topDemoLink.clicks / totalDemoClicks) * 100)
                      : 0
                  )
                )}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* ── 2. 실제 운영 중인 공개 페이지 쇼케이스 (Firestore 실시간 연동) ── */}
      {(isPublicLoading || hasPublicShowcase) && (
        <section id="showcase" aria-label="실제 운영 중인 페이지 미리보기">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="brand">실시간 공개 페이지</Badge>
                  <span className="text-[12px] font-semibold text-[#8B95A1]">
                    실제 Firestore 데이터로 동작해요
                  </span>
                </div>
                <h2 className="text-[17px] sm:text-[19px] font-bold tracking-[-0.015em] text-[#191F28]">
                  지금 만들어져 있는 MyLink 페이지 구경하기
                </h2>
              </div>

              {hasPublicShowcase && publicProfile && (
                <Link href={publicProfileHref} className="self-start sm:self-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    tabIndex={-1}
                    className="h-9 rounded-full px-4 text-[12.5px] font-bold gap-1.5"
                  >
                    /{publicProfile.displayName} 방문하기
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              )}
            </div>

            <Separator className="mb-4" />

            {isPublicLoading && !hasPublicShowcase ? (
              <div className="py-6 flex items-center justify-center gap-2 text-[13px] font-medium text-[#6B7684]">
                <Loader2
                  className="w-4 h-4 animate-spin text-[#3182F6]"
                  aria-hidden="true"
                />
                공개 프로필을 불러오고 있어요...
              </div>
            ) : (
              publicProfile && (
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-center">
                  {/* 실제 크리에이터 요약 박스 */}
                  <div className="rounded-[18px] bg-[#F9FAFB] border border-[#E5E8EB] p-4 flex items-center md:flex-col md:text-center gap-3.5">
                    <div className="relative shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-[#E8F3FF] via-[#F2F4F6] to-[#E8F3FF] border border-[#E5E8EB]/80">
                      <Avatar className="w-14 h-14 md:w-16 md:h-16">
                        <AvatarImage
                          src={publicProfile.photoURL}
                          alt={`${publicProfile.displayName} 프로필 사진`}
                          fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                        />
                      </Avatar>
                      <span
                        className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#34C759] ring-2 ring-white"
                        aria-label="온라인"
                      />
                    </div>

                    <div className="min-w-0 flex-1 md:w-full">
                      <p className="text-[15.5px] font-bold text-[#191F28] truncate">
                        {publicProfile.displayName}
                      </p>
                      <p className="text-[12px] text-[#6B7684] line-clamp-2 break-keep mt-0.5">
                        {publicProfile.bio}
                      </p>
                      <div className="flex items-center md:justify-center gap-1.5 mt-2.5 flex-wrap">
                        <Badge variant="default" className="h-[22px] text-[11px]">
                          링크 {publicLinks.length}개
                        </Badge>
                        <Badge variant="brand" className="h-[22px] text-[11px]">
                          방문 가능
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 실제 등록된 링크 미리보기 (최대 3개) */}
                  {featuredPublicLinks.length === 0 ? (
                    <div className="py-8 px-4 text-center rounded-[18px] bg-[#F9FAFB] border border-dashed border-[#E5E8EB]">
                      <p className="text-[13.5px] font-semibold text-[#4E5968] mb-1">
                        아직 공개된 링크가 없어요
                      </p>
                      <p className="text-[12px] text-[#8B95A1]">
                        Google로 로그인해서 첫 번째 링크를 등록해 보세요!
                      </p>
                    </div>
                  ) : (
                    <ul role="list" className="flex flex-col gap-2">
                      {featuredPublicLinks.map((link) => (
                        <li key={link.id} role="listitem">
                          <Link
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onTrackPublicLinkClick(link.id)}
                            className="block rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40"
                          >
                            <CardListRow className="p-3 sm:p-3.5 justify-between">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E5E8EB] flex items-center justify-center text-[#3182F6] shrink-0">
                                  <Globe
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-[13.5px] sm:text-[14px]">
                                    {link.title}
                                  </CardTitle>
                                  <CardDescription className="text-[11.5px] truncate">
                                    {link.description || link.url}
                                  </CardDescription>
                                </div>
                              </div>
                              <ArrowUpRight
                                className="w-4 h-4 text-[#8B95A1] group-hover:text-[#3182F6] transition-colors shrink-0"
                                aria-hidden="true"
                              />
                            </CardListRow>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}
          </Card>
        </section>
      )}

      {/* ── 3. 핵심 기능 3단 Bento Grid ── */}
      <section
        id="features"
        aria-label="마이링크 핵심 기능"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* 기능 1: 직관적인 링크 관리 */}
        <Card className="p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-[#E8F3FF] flex items-center justify-center text-[#3182F6]">
              <Link2 className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
            <h2 className="text-[16px] font-bold tracking-[-0.015em] text-[#191F28]">
              클릭 몇 번으로 링크 관리
            </h2>
            <p className="text-[13px] leading-[1.55] text-[#6B7684] break-keep">
              제목과 주소만 입력하면 바로 저장돼요. 수정이나 삭제도 내 페이지에서
              즉시 반영돼요.
            </p>
          </div>

          <div className="rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] p-3 flex items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-[#191F28] truncate">
              포트폴리오 노션
            </span>
            <Badge variant="new">저장됨 ✓</Badge>
          </div>
        </Card>

        {/* 기능 2: 방문자 친화 공개 페이지 */}
        <Card className="p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-[#F2F4F6] flex items-center justify-center text-[#191F28]">
              <Zap className="w-[18px] h-[18px] text-[#3182F6]" aria-hidden="true" />
            </div>
            <h2 className="text-[16px] font-bold tracking-[-0.015em] text-[#191F28]">
              방문자에겐 더 깔끔한 뷰
            </h2>
            <p className="text-[13px] leading-[1.55] text-[#6B7684] break-keep">
              내 전용 주소로 공유하면 방문자 화면에서는 클릭 숫자를 숨겨 더
              정갈하게 보여줘요.
            </p>
          </div>

          <div className="rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] p-3 flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-[#6B7684] truncate">
              /my-handle
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4E5968] shrink-0">
              <EyeOff className="w-3 h-3 text-[#8B95A1]" aria-hidden="true" />
              숫자 숨김
            </span>
          </div>
        </Card>

        {/* 기능 3: 실시간 클릭 통계 차트 */}
        <Card className="p-5 sm:p-6 flex flex-col justify-between gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-[#E8F3FF] flex items-center justify-center text-[#3182F6]">
              <BarChart3 className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
            <h2 className="text-[16px] font-bold tracking-[-0.015em] text-[#191F28]">
              한눈에 보는 클릭 통계
            </h2>
            <p className="text-[13px] leading-[1.55] text-[#6B7684] break-keep">
              어떤 링크가 가장 인기가 많은지 통계(/stats) 대시보드에서 막대
              그래프와 순위로 확인해요.
            </p>
          </div>

          <div className="rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] px-3.5 py-2.5 flex items-end justify-between gap-3">
            <div className="flex items-end gap-1.5 h-10" aria-hidden="true">
              <span className="w-2.5 h-5 rounded-t-[4px] bg-[#C7DFFD]" />
              <span className="w-2.5 h-10 rounded-t-[4px] bg-[#3182F6]" />
              <span className="w-2.5 h-7 rounded-t-[4px] bg-[#84B6FA]" />
              <span className="w-2.5 h-4 rounded-t-[4px] bg-[#ADCEFC]" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#3182F6]">
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
              인기 순위 집계
            </span>
          </div>
        </Card>
      </section>

      {/* ── 4. 3단계 사용 방법 ── */}
      <section aria-label="마이링크 시작 방법">
        <Card className="p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-[17px] sm:text-[19px] font-bold tracking-[-0.015em] text-[#191F28]">
              복잡한 설정 없이, 딱 3단계면 끝나요
            </h2>
            <p className="text-[12.5px] sm:text-[13px] text-[#6B7684] mt-0.5">
              처음 만드는 사람도 1분 안에 나만의 링크 페이지를 공유할 수 있어요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STEP_ITEMS.map((item) => (
              <div
                key={item.step}
                className="rounded-[18px] bg-[#F9FAFB] border border-[#E5E8EB] p-4 flex flex-col gap-1.5"
              >
                <span className="text-[11px] font-extrabold tracking-[0.04em] text-[#3182F6]">
                  {item.step}
                </span>
                <h3 className="text-[14.5px] font-bold text-[#191F28]">
                  {item.title}
                </h3>
                <p className="text-[12.5px] leading-[1.55] text-[#6B7684] break-keep">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── 5. 자주 묻는 질문 (아코디언 FAQ) ── */}
      <section id="faq" aria-label="자주 묻는 질문">
        <Card className="p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-[17px] sm:text-[19px] font-bold tracking-[-0.015em] text-[#191F28]">
              자주 묻는 질문
            </h2>
            <p className="text-[12.5px] sm:text-[13px] text-[#6B7684] mt-0.5">
              시작하기 전에 궁금한 점을 먼저 확인해 보세요.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenFaqIndex(isOpen ? null : index)
                    }
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#F2F4F6]/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40"
                  >
                    <span className="text-[13.5px] sm:text-[14px] font-bold text-[#191F28] break-keep">
                      Q. {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-[#6B7684] shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-[#3182F6]"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3.5 pt-0.5 text-[12.5px] sm:text-[13px] leading-[1.6] text-[#4E5968] break-keep">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* ── 6. 하단 마무리 CTA 카드 ── */}
      <section aria-label="지금 바로 시작하기">
        <Card className="p-6 sm:p-8 bg-[#E8F3FF]/65 border-[#3182F6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] sm:text-[20px] font-extrabold tracking-[-0.02em] text-[#191F28] break-keep">
              나만의 링크 페이지, 지금 바로 만들어 보세요
            </h2>
            <p className="text-[13px] sm:text-[13.5px] text-[#4E5968] break-keep">
              Google 계정으로 로그인하면 바로 내 페이지를 꾸밀 수 있어요.
            </p>
          </div>

          {isLoggedInPreview && onExitPreview ? (
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={onExitPreview}
              className="h-11 sm:h-12 rounded-[14px] px-5 text-[14.5px] font-bold shrink-0"
            >
              내 링크 관리로 돌아가기
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="lg"
              disabled={isAuthActionLoading}
              onClick={onGoogleLogin}
              className="h-11 sm:h-12 rounded-[14px] px-5 text-[14.5px] font-bold gap-2 shrink-0"
            >
              {isAuthActionLoading ? (
                <Loader2
                  className="w-4 h-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <>
                    <span className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0">
                      <GoogleIcon className="w-3 h-3" />
                    </span>
                  Google로 시작하기
                </>
              )}
            </Button>
          )}
        </Card>
      </section>
    </main>
  );
}
