"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Code2,
  EyeOff,
  GraduationCap,
  Link2,
  Loader2,
  MousePointerClick,
  Palette,
  RotateCcw,
  Sparkles,
  Trophy,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardListRow } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/profile/ProfileHeader";
import { cn } from "@/lib/utils";

export interface LandingSectionsProps {
  isAuthActionLoading?: boolean;
  isLoggedInPreview?: boolean;
  onGoogleLogin: () => void;
  onExitPreview?: () => void;
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

// 인터랙티브 체험 카드용 예시 페르소나 프리셋 (실제 유저 개인정보 미사용)
const PERSONA_PRESETS: Record<PersonaKey, PersonaPreset> = {
  developer: {
    key: "developer",
    label: "개발자",
    defaultName: "김개발",
    defaultHandle: "dev_kim",
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

const STEP_ITEMS = [
  {
    step: "01",
    title: "Google로 3초 로그인",
    description: "복잡한 회원가입 없이 구글 계정 한 번으로 바로 시작해요.",
  },
  {
    step: "02",
    title: "프로필과 링크 담기",
    description: "한 줄 소개와 프로필 사진, 자주 쓰는 링크들을 등록해요.",
  },
  {
    step: "03",
    title: "공유하고 통계 확인",
    description: "내 전용 주소로 공유하고 인기 링크 순위를 확인해요.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "정말 무료로 내 링크 페이지를 만들 수 있나요?",
    answer:
      "네, 100% 무료예요. 별도 요금제나 링크 개수 제한 없이 원하는 만큼 링크를 등록하고 수정할 수 있어요.",
  },
  {
    question: "내 개인 페이지 주소(/아이디)는 어떻게 정해지나요?",
    answer:
      "Google 계정으로 로그인하면 이메일 아이디 앞부분을 바탕으로 개인 페이지 주소가 자동으로 만들어져요. 상단 마이페이지 버튼으로 바로 이동할 수 있어요.",
  },
  {
    question: "방문자도 내 링크 클릭수를 볼 수 있나요?",
    answer:
      "아니요! 방문자가 보는 공개 페이지에서는 클릭수가 깔끔하게 숨겨져 있어요. 클릭수 요약과 인기 순위 차트(/stats)는 로그인한 본인만 확인할 수 있어요.",
  },
  {
    question: "모바일에서도 예쁘게 보이나요?",
    answer:
      "네, 스마트폰부터 태블릿, 데스크톱 화면까지 모든 화면 크기에 맞춰 카드와 버튼 배치가 자동으로 최적화돼요.",
  },
] as const;

export function LandingSections({
  isAuthActionLoading = false,
  isLoggedInPreview = false,
  onGoogleLogin,
  onExitPreview,
}: LandingSectionsProps) {
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
    (sum, value) => sum + value,
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

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 로그인 상태에서 랜딩 화면 미리보기 시 돌아가기 배너 */}
      {isLoggedInPreview && onExitPreview && (
        <div className="rounded-[18px] bg-[#E8F3FF] border border-[#3182F6]/25 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#191F28]">
            <Sparkles
              className="w-4 h-4 text-[#3182F6] shrink-0"
              aria-hidden="true"
            />
            <span>
              비로그인 방문자에게 보이는 랜딩 페이지를 미리 보고 있어요.
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

      {/* ── 1. 깔끔한 서비스 랜딩 히어로 섹션 (개인 프사 미노출 · One Link 스타일 × TDS 카드) ── */}
      <section aria-label="마이링크 서비스 히어로">
        <Card className="w-full px-5 py-10 sm:px-10 sm:py-14 flex flex-col items-center text-center">
          <Badge
            variant="brand"
            className="h-7 px-3 text-[12px] font-bold mb-4 gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            나만의 링크를 한 곳에
          </Badge>

          <h1 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.16] tracking-[-0.03em] text-[#191F28] break-keep mb-3.5">
            Every Link in{" "}
            <span className="text-[#3182F6]">One Link.</span>
          </h1>

          <p className="text-[14px] sm:text-[15.5px] leading-[1.6] text-[#6B7684] max-w-[440px] break-keep mb-6">
            GitHub, 블로그, 포트폴리오까지.
            <br />
            흩어진 모든 링크를 깔끔한 한 페이지에 담아보세요.
          </p>

          {isLoggedInPreview && onExitPreview ? (
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={onExitPreview}
              className="h-12 rounded-[14px] px-7 text-[15px] font-bold gap-2"
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
              className="h-12 rounded-[14px] px-7 text-[15px] font-bold gap-2.5"
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
                  Google로 시작하기
                </>
              )}
            </Button>
          )}

          {/* 추상화된 MyLink 미니 카드 일러스트 (개인 계정 사진 없이 깔끔한 프리뷰 표현) */}
          <div
            aria-hidden="true"
            className="mt-9 sm:mt-11 w-full max-w-[330px] rounded-[22px] bg-white border border-[#E5E8EB] p-4 sm:p-5 shadow-[0_14px_34px_rgba(25,31,40,0.06)] -rotate-2 hover:rotate-0 transition-transform duration-300 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F2F4F6] border border-[#E5E8EB]/80 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-2.5 w-24 rounded-full bg-[#E5E8EB]" />
                <div className="h-2 w-36 rounded-full bg-[#F2F4F6]" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="rounded-[12px] bg-[#E8F3FF] px-3 py-2.5 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3182F6] shrink-0" />
                <span className="h-2.5 w-32 rounded-full bg-[#3182F6]/30" />
                <span className="ml-auto h-3.5 w-9 rounded-full bg-white/90" />
              </div>

              <div className="rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB]/80 px-3 py-2.5 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1] shrink-0" />
                <span className="h-2.5 w-24 rounded-full bg-[#E5E8EB]" />
              </div>

              <div className="rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB]/80 px-3 py-2.5 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1] shrink-0" />
                <span className="h-2.5 w-28 rounded-full bg-[#E5E8EB]" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ── 2. 인터랙티브 체험 섹션 (310px + 1fr 반응형 2단 그리드) ── */}
      <section
        aria-label="나만의 MyLink 미리 체험하기"
        className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-5 items-stretch"
      >
        {/* 좌측 카드 (310px): 주소 미리 입력 + 페르소나 선택 */}
        <Card className="w-full p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles
                  className="w-4 h-4 text-[#3182F6] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-[13.5px] sm:text-[14px] font-bold tracking-[-0.01em] text-[#191F28]">
                  내 페이지 미리 써보기
                </h2>
              </div>
              <Badge variant="brand">체험</Badge>
            </div>

            <Separator />

            <p className="text-[12.5px] leading-[1.55] text-[#6B7684] break-keep">
              아이디와 컨셉을 고르면 오른쪽 미리보기 카드의 프로필과 링크가 바로
              바뀌어요.
            </p>

            {/* 페이지 이름 입력 필드 */}
            <div className="rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] p-3 flex flex-col gap-1.5">
              <label
                htmlFor="landing-handle-input"
                className="text-[11.5px] font-bold text-[#4E5968]"
              >
                페이지 주소 미리 입력하기
              </label>
              <div className="flex items-center gap-1 rounded-[12px] bg-white border border-[#E5E8EB] focus-within:border-[#3182F6] focus-within:ring-2 focus-within:ring-[#3182F6]/20 px-2.5 h-10 transition-all">
                <span className="text-[12.5px] font-semibold text-[#8B95A1] shrink-0 select-none">
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
                  className="w-full bg-transparent text-[13px] font-bold text-[#191F28] placeholder:text-[#B0B8C1] placeholder:font-medium focus:outline-none min-w-0"
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

            {/* 페르소나 선택 칩 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold text-[#4E5968]">
                컨셉 골라보기
              </span>
              <div
                role="tablist"
                aria-label="체험 페르소나 선택"
                className="grid grid-cols-3 gap-1.5"
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
                        "inline-flex items-center justify-center gap-1 rounded-[12px] py-2 px-2 text-[12px] font-bold border transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#E8F3FF] text-[#3182F6] border-[#3182F6]/30"
                          : "bg-[#F9FAFB] text-[#6B7684] border-[#E5E8EB] hover:text-[#191F28] hover:bg-[#F2F4F6]"
                      )}
                    >
                      {key === "developer" && (
                        <Code2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {key === "designer" && (
                        <Palette className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {key === "student" && (
                        <GraduationCap
                          className="w-3.5 h-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {isLoggedInPreview && onExitPreview ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onExitPreview}
              className="w-full h-10 rounded-[12px] text-[13px] font-bold"
            >
              내 링크 관리로 돌아가기
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isAuthActionLoading}
              onClick={onGoogleLogin}
              className="w-full h-10 rounded-[12px] text-[13px] font-bold gap-2"
            >
              {isAuthActionLoading ? (
                <Loader2
                  className="w-3.5 h-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                    <GoogleIcon className="w-3 h-3" />
                  </span>
                  이 주소로 바로 시작하기
                </>
              )}
            </Button>
          )}
        </Card>

        {/* 우측 카드 (1fr): 클릭 카운트를 직접 눌러 체험하는 카드 */}
        <Card className="w-full p-5 sm:p-6 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full bg-[#34C759] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-[13px] sm:text-[13.5px] font-bold tracking-[-0.01em] text-[#191F28] truncate">
                  클릭 반응 실시간 체험
                </h2>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {totalAddedByUser > 0 && (
                  <button
                    type="button"
                    onClick={handleResetDemoClicks}
                    className="inline-flex items-center gap-1 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] px-2 py-0.5 text-[11px] font-semibold text-[#6B7684] hover:text-[#191F28] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                    초기화
                  </button>
                )}
                <Badge
                  variant="secondary"
                  className="h-[22px] px-2 text-[11px] font-semibold gap-1 text-[#4E5968] tabular-nums"
                >
                  <MousePointerClick
                    className="w-3 h-3 text-[#3182F6]"
                    aria-hidden="true"
                  />
                  {totalDemoClicks}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* 실시간 미니 프로필 프리뷰 */}
            <div className="rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] p-3 flex items-center gap-3">
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0 border border-white shadow-[0_1px_2px_rgba(25,31,40,0.06)]",
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
                  <p className="text-[14px] font-bold text-[#191F28] truncate">
                    {previewName}
                  </p>
                  <Badge variant="brand">{persona.roleBadge}</Badge>
                </div>
                <p className="text-[11.5px] font-medium text-[#8B95A1] truncate mt-0.5">
                  /{previewHandle} · {persona.bio}
                </p>
              </div>
            </div>

            {/* 클릭 가능한 샘플 링크 목록 */}
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
                          "p-3 sm:p-3.5 justify-between",
                          isJustClicked &&
                            "border-[#3182F6]/40 bg-[#E8F3FF]/50 hover:bg-[#E8F3FF]/70"
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
          </div>

          {/* 실시간 인기 순위 미니 바 */}
          <div className="rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 text-[11.5px]">
              <span className="inline-flex items-center gap-1.5 min-w-0 font-semibold text-[#4E5968]">
                <Trophy
                  className="w-3.5 h-3.5 text-[#F59E0B] shrink-0"
                  aria-hidden="true"
                />
                <span className="shrink-0">현재 1위:</span>
                <span className="font-bold text-[#191F28] truncate">
                  {topDemoLink.title}
                </span>
              </span>
              <span className="font-bold text-[#3182F6] tabular-nums shrink-0">
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

      {/* ── 3. 핵심 기능 3단 Bento Grid ── */}
      <section
        aria-label="마이링크 주요 특징"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        <Card className="p-5 flex flex-col justify-between gap-3.5">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-[#E8F3FF] flex items-center justify-center text-[#3182F6]">
              <Link2 className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
            <h2 className="text-[15px] font-bold tracking-[-0.015em] text-[#191F28]">
              손쉬운 링크 추가·관리
            </h2>
            <p className="text-[12.5px] leading-[1.55] text-[#6B7684] break-keep">
              제목과 주소만 넣으면 즉시 저장되고 수정·삭제도 클릭 한 번이면 끝나요.
            </p>
          </div>
          <div className="rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 py-2.5 flex items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-[#191F28] truncate">
              포트폴리오 노션
            </span>
            <Badge variant="new">저장됨 ✓</Badge>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-3.5">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-[#F2F4F6] flex items-center justify-center text-[#8B5CF6]">
              <UserCheck className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
            <h2 className="text-[15px] font-bold tracking-[-0.015em] text-[#191F28]">
              방문자에겐 정갈한 공개 뷰
            </h2>
            <p className="text-[12.5px] leading-[1.55] text-[#6B7684] break-keep">
              개인 주소로 공유하면 클릭 숫자는 숨기고 프로필과 링크만 깔끔히 보여줘요.
            </p>
          </div>
          <div className="rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 py-2.5 flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-[#6B7684] truncate">
              /my-handle
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4E5968] shrink-0">
              <EyeOff className="w-3 h-3 text-[#8B95A1]" aria-hidden="true" />
              클릭수 숨김
            </span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-3.5 sm:col-span-2 md:col-span-1">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-[12px] bg-[#E8F3FF] flex items-center justify-center text-[#3182F6]">
              <BarChart3 className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
            <h2 className="text-[15px] font-bold tracking-[-0.015em] text-[#191F28]">
              인기 링크 클릭 통계
            </h2>
            <p className="text-[12.5px] leading-[1.55] text-[#6B7684] break-keep">
              가장 인기 있는 링크를 막대 그래프와 순위 리스트로 한눈에 살펴보세요.
            </p>
          </div>
          <div className="rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 py-2 flex items-end justify-between gap-2">
            <div className="flex items-end gap-1.5 h-8" aria-hidden="true">
              <span className="w-2 h-4 rounded-t-[3px] bg-[#C7DFFD]" />
              <span className="w-2 h-8 rounded-t-[3px] bg-[#3182F6]" />
              <span className="w-2 h-6 rounded-t-[3px] bg-[#84B6FA]" />
              <span className="w-2 h-3 rounded-t-[3px] bg-[#ADCEFC]" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3182F6]">
              <Trophy className="w-3 h-3 text-[#F59E0B]" aria-hidden="true" />
              실시간 집계
            </span>
          </div>
        </Card>
      </section>

      {/* ── 4. 시작 가이드 + 자주 묻는 질문 (310px + 1fr 2단 그리드) ── */}
      <section
        aria-label="이용 방법 및 자주 묻는 질문"
        className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-5 items-stretch"
      >
        <Card className="w-full p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[13.5px] sm:text-[14px] font-bold tracking-[-0.01em] text-[#191F28]">
              📌 딱 3단계면 시작해요
            </h2>
            <Badge variant="default" className="h-[22px] text-[11px]">
              1분 완성
            </Badge>
          </div>

          <Separator />

          <div className="flex flex-col gap-2.5 flex-1 justify-between">
            {STEP_ITEMS.map((item) => (
              <div
                key={item.step}
                className="rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 flex items-start gap-2.5"
              >
                <span className="w-6 h-6 rounded-full bg-[#E8F3FF] text-[#3182F6] text-[11px] font-extrabold flex items-center justify-center shrink-0 tabular-nums mt-0.5">
                  {item.step}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-bold text-[#191F28]">
                    {item.title}
                  </h3>
                  <p className="text-[12px] leading-[1.5] text-[#6B7684] break-keep mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="w-full p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[13.5px] sm:text-[14px] font-bold tracking-[-0.01em] text-[#191F28]">
              💬 자주 묻는 질문
            </h2>
            <Badge variant="count">{FAQ_ITEMS.length}</Badge>
          </div>

          <Separator />

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
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left hover:bg-[#F2F4F6]/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40"
                  >
                    <span className="text-[13px] sm:text-[13.5px] font-bold text-[#191F28] break-keep">
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
                    <div className="px-3.5 pb-3 pt-0.5 text-[12px] sm:text-[12.5px] leading-[1.6] text-[#4E5968] break-keep">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* ── 5. 하단 마무리 CTA 카드 ── */}
      <Card className="p-5 sm:p-6 bg-[#E8F3FF]/65 border-[#3182F6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] text-[#191F28] break-keep">
            나만의 링크 페이지, 지금 바로 만들어 보세요
          </h2>
          <p className="text-[12.5px] sm:text-[13px] text-[#4E5968] break-keep mt-0.5">
            Google 로그인 후 10초 안에 첫 번째 링크를 등록할 수 있어요.
          </p>
        </div>

        {isLoggedInPreview && onExitPreview ? (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onExitPreview}
            className="h-10 rounded-full px-5 text-[13px] font-bold shrink-0 self-start sm:self-auto"
          >
            내 링크 관리로 돌아가기
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isAuthActionLoading}
            onClick={onGoogleLogin}
            className="h-10 rounded-full px-5 text-[13px] font-bold gap-2 shrink-0 self-start sm:self-auto"
          >
            {isAuthActionLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <>
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                  <GoogleIcon className="w-3 h-3" />
                </span>
                Google로 시작하기
              </>
            )}
          </Button>
        )}
      </Card>
    </div>
  );
}
