"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  Link2,
  Loader2,
  MousePointerClick,
  RefreshCw,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { PreviewProfileDialog } from "@/components/profile/PreviewProfileDialog";
import { MyPageTopBar } from "@/components/profile/ProfileHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_PROFILE_DATA } from "@/constants";
import { auth, db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { LinkItem } from "@/types";

interface StatsUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
}

const chartConfig = {
  clickCount: {
    label: "클릭수",
    color: "#3182F6",
  },
} satisfies ChartConfig;

// 인라인 style 없이 프로그레스 바 너비를 표현하기 위한 Tailwind 유틸리티 클래스 매핑
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

function getEmailPrefix(email?: string | null) {
  return email ? email.split("@")[0] : "";
}

const BAR_COLORS = [
  "#3182F6",
  "#5A9CF8",
  "#84B6FA",
  "#ADCEFC",
  "#C7DFFD",
] as const;

export default function StatsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Firebase 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 로그인 필수: 비로그인 시 마이페이지(/)로 리다이렉트
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/");
    }
  }, [isAuthLoading, user, router]);

  // 유저 프로필 정보 조회 (기존 사이트 헤더, 프로필 수정, 미리보기용)
  const { data: userProfile } = useQuery<StatsUserProfile>({
    queryKey: ["users", user?.uid, "profile"],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      if (!user) {
        return {
          uid: "",
          displayName: DEFAULT_PROFILE_DATA.displayName,
          email: "",
          photoURL: DEFAULT_PROFILE_DATA.avatarUrl,
          bio: DEFAULT_PROFILE_DATA.bio,
        };
      }

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      const data = userSnap.exists() ? userSnap.data() : null;
      const resolvedEmail = data?.email || user.email || "";

      return {
        uid: user.uid,
        displayName:
          data?.displayName ||
          getEmailPrefix(resolvedEmail) ||
          user.displayName ||
          DEFAULT_PROFILE_DATA.displayName,
        email: resolvedEmail,
        photoURL:
          data?.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl,
        bio: data?.bio || DEFAULT_PROFILE_DATA.bio,
      };
    },
  });

  // Firestore(users/{user.uid}/links)에서 클릭수 내림차순(orderBy('clickCount', 'desc'))으로 링크 통계 조회
  const {
    data: links = [],
    isLoading: isLinksLoading,
    isFetching: isLinksFetching,
    refetch,
  } = useQuery<LinkItem[]>({
    queryKey: ["users", user?.uid, "statsLinks"],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      if (!user?.uid) return [];
      const linksRef = collection(db, "users", user.uid, "links");
      const q = query(linksRef, orderBy("clickCount", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: user.uid,
          title: data.title ?? "",
          url: data.url ?? "",
          description: data.description || data.url || "",
          category: data.category,
          icon: data.icon,
          badge: data.badge,
          actionLabel: data.actionLabel ?? "방문",
          isActive: data.isActive ?? true,
          clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
          createdAt: data.createdAt ?? "",
          updatedAt: data.updatedAt ?? undefined,
        };
      });
    },
  });

  // 헤더의 프로필 수정 모달 연동 (낙관적 업데이트 적용)
  const updateProfileMutation = useMutation({
    mutationFn: async (values: { bio: string; photoURL: string }) => {
      if (!user) throw new Error("로그인이 필요해요.");
      const now = new Date().toISOString();
      const nextPhotoURL =
        values.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          bio: values.bio,
          photoURL: nextPhotoURL,
          updatedAt: now,
        },
        { merge: true }
      );
    },
    onMutate: async (newValues) => {
      if (!user) return { previousProfile: undefined };

      const profileQueryKey = ["users", user.uid, "profile"] as const;
      await queryClient.cancelQueries({ queryKey: profileQueryKey });

      const previousProfile =
        queryClient.getQueryData<StatsUserProfile>(profileQueryKey);

      const nextPhotoURL =
        newValues.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;

      queryClient.setQueryData<StatsUserProfile>(profileQueryKey, (old) => ({
        uid: user.uid,
        displayName:
          old?.displayName ||
          getEmailPrefix(user.email) ||
          user.displayName ||
          DEFAULT_PROFILE_DATA.displayName,
        email: old?.email || user.email || "",
        bio: newValues.bio,
        photoURL: nextPhotoURL,
      }));

      return { previousProfile };
    },
    onSuccess: () => {
      toast.success("프로필이 수정됐어요 ✓");
    },
    onError: (error, _newValues, context) => {
      console.error("Firestore 프로필 수정 실패:", error);
      if (user && context?.previousProfile) {
        queryClient.setQueryData(
          ["users", user.uid, "profile"],
          context.previousProfile
        );
      }
      toast.error("프로필 수정에 실패했어요. 다시 시도해 주세요.");
    },
    onSettled: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ["users", user.uid, "profile"],
        });
      }
    },
  });

  const handleLogout = async () => {
    setIsAuthActionLoading(true);
    try {
      await signOut(auth);
      queryClient.clear();
      toast.success("로그아웃됐어요 ✓");
      router.replace("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.error("로그아웃에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // 인증 확인 중이거나 비로그인 상태(리다이렉트 대기)일 때 로딩 카드 표시
  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
        <Card className="w-full max-w-[420px] px-6 py-14 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2
            className="w-7 h-7 text-[#3182F6] animate-spin"
            aria-hidden="true"
          />
          <p className="text-[13.5px] font-medium text-[#6B7684]">
            {isAuthLoading
              ? "로그인 상태를 확인하고 있어요..."
              : "로그인 페이지로 이동하고 있어요..."}
          </p>
        </Card>
      </div>
    );
  }

  const displayUserName =
    userProfile?.displayName ||
    getEmailPrefix(user.email) ||
    user.displayName ||
    DEFAULT_PROFILE_DATA.displayName;
  const displayUserEmail = userProfile?.email || user.email || "";
  const displayUserAvatar =
    userProfile?.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;
  const displayUserBio = userProfile?.bio || DEFAULT_PROFILE_DATA.bio;

  const handleCopyPageLink = () => {
    if (typeof window !== "undefined") {
      const targetUrl = `${window.location.origin}/${encodeURIComponent(
        displayUserName
      )}`;
      navigator.clipboard.writeText(targetUrl);
      toast.success("내 페이지 링크가 복사됐어요 ✓");
    }
  };

  const handleShare = () => {
    const shareTitle = `${displayUserName} | MyLink`;
    const targetUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${encodeURIComponent(displayUserName)}`
        : "";

    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: shareTitle,
        url: targetUrl,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(targetUrl);
      toast.success("내 페이지 링크가 복사됐어요 ✓");
    }
  };

  const handleUpdateProfile = async (values: {
    bio: string;
    photoURL: string;
  }) => {
    await updateProfileMutation.mutateAsync(values);
  };

  // 총 클릭수 (모든 링크 합산) 및 주요 통계 지표
  const totalClicks = links.reduce(
    (sum, item) => sum + (typeof item.clickCount === "number" ? item.clickCount : 0),
    0
  );
  const topLink = links[0];
  const topLinkClicks =
    topLink && typeof topLink.clickCount === "number" ? topLink.clickCount : 0;
  const topLinkShare =
    totalClicks > 0 ? Math.round((topLinkClicks / totalClicks) * 100) : 0;
  const maxClicks = topLinkClicks;

  const chartData = links.map((link, index) => ({
    id: link.id,
    name:
      link.title.length > 9 ? `${link.title.slice(0, 9)}…` : link.title,
    fullTitle: link.title,
    url: link.url,
    clickCount: typeof link.clickCount === "number" ? link.clickCount : 0,
    fill: BAR_COLORS[Math.min(index, BAR_COLORS.length - 1)],
  }));

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
      {/* ── 기존 사이트와 동일한 상단 마이페이지 헤더 바 (페이지 이동 지원) ── */}
      <MyPageTopBar
        displayName={displayUserName}
        email={displayUserEmail}
        avatarUrl={displayUserAvatar}
        isLoggedIn={Boolean(user)}
        isAuthActionLoading={isAuthActionLoading}
        onLogout={handleLogout}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onPreviewPage={() => setIsPreviewOpen(true)}
        onCopyPageLink={handleCopyPageLink}
        onShare={handleShare}
      />

      {/* ── 메인 통계 대시보드 영역 ── */}
      <main role="main" className="w-full max-w-[860px] flex flex-col gap-5">
        {/* 상단 요약 카드 + KPI 지표 */}
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3
                  className="w-5 h-5 text-[#3182F6]"
                  aria-hidden="true"
                />
                <h1 className="text-[19px] sm:text-[21px] font-bold tracking-[-0.02em] text-[#191F28]">
                  링크 클릭 통계
                </h1>
              </div>
              <p className="text-[13px] text-[#6B7684]">
                {displayUserName}님의 전체 링크 클릭수와 인기 순위를 한눈에 확인해 보세요.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link href="/">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  tabIndex={-1}
                  className="h-9 rounded-full px-3.5 text-[12.5px] font-bold gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  링크 관리
                </Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isLinksFetching}
                onClick={() => refetch()}
                className="h-9 rounded-full px-3.5 text-[12.5px] font-bold gap-1.5"
              >
                <RefreshCw
                  className={cn(
                    "w-3.5 h-3.5",
                    isLinksFetching && "animate-spin text-[#3182F6]"
                  )}
                  aria-hidden="true"
                />
                새로고침
              </Button>
            </div>
          </div>

          {/* 3개 KPI 요약 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* KPI 1: 총 클릭수 (Primary 강조) */}
            <div className="rounded-[18px] bg-[#E8F3FF]/70 border border-[#3182F6]/20 p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-[#3182F6]">
                  총 클릭수
                </span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3182F6]">
                  <MousePointerClick className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
              <div>
                <p className="text-[28px] sm:text-[32px] font-extrabold leading-none tracking-[-0.02em] text-[#191F28] tabular-nums">
                  {totalClicks.toLocaleString()}
                </p>
                <p className="text-[11.5px] font-medium text-[#4E5968] mt-1.5">
                  전체 링크 클릭수 합산
                </p>
              </div>
            </div>

            {/* KPI 2: 등록된 링크 수 */}
            <div className="rounded-[18px] bg-[#F9FAFB] border border-[#E5E8EB] p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-[#6B7684]">
                  집계 중인 링크
                </span>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center text-[#4E5968]">
                  <Link2 className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
              <div>
                <p className="text-[28px] sm:text-[32px] font-extrabold leading-none tracking-[-0.02em] text-[#191F28] tabular-nums">
                  {links.length.toLocaleString()}
                </p>
                <p className="text-[11.5px] font-medium text-[#8B95A1] mt-1.5">
                  평균{" "}
                  <span className="font-bold text-[#4E5968] tabular-nums">
                    {links.length > 0
                      ? (
                          Math.round((totalClicks / links.length) * 10) / 10
                        ).toLocaleString()
                      : 0}
                  </span>
                  회 / 링크
                </p>
              </div>
            </div>

            {/* KPI 3: 가장 많이 클릭된 링크 */}
            <div className="rounded-[18px] bg-[#F9FAFB] border border-[#E5E8EB] p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-[#6B7684]">
                  최다 클릭 링크
                </span>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center text-[#F59E0B]">
                  <Trophy className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[18px] sm:text-[20px] font-bold leading-snug tracking-[-0.015em] text-[#191F28] truncate">
                  {topLink ? topLink.title : "-"}
                </p>
                <p className="text-[11.5px] font-medium text-[#8B95A1] mt-1">
                  {topLink ? (
                    <>
                      <span className="font-bold text-[#3182F6] tabular-nums">
                        {topLinkClicks.toLocaleString()}
                      </span>
                      회 클릭 · 점유율{" "}
                      <span className="font-bold text-[#4E5968] tabular-nums">
                        {topLinkShare}%
                      </span>
                    </>
                  ) : (
                    "등록된 링크가 없어요"
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 차트 & 링크별 순위 리스트 */}
        {isLinksLoading ? (
          <Card className="p-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2
              className="w-7 h-7 text-[#3182F6] animate-spin"
              aria-hidden="true"
            />
            <p className="text-[13.5px] font-medium text-[#6B7684]">
              링크 통계 데이터를 불러오고 있어요...
            </p>
          </Card>
        ) : links.length === 0 ? (
          <Card className="p-10 sm:p-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E8F3FF] flex items-center justify-center text-[#3182F6]">
              <BarChart3 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#191F28] mb-1">
                아직 통계를 표시할 링크가 없어요
              </p>
              <p className="text-[13px] text-[#6B7684]">
                마이페이지에서 첫 번째 링크를 추가하면 클릭 통계를 차트로 확인할 수 있어요.
              </p>
            </div>
            <Link href="/" className="mt-1">
              <Button
                type="button"
                variant="default"
                tabIndex={-1}
                className="h-10 rounded-full px-5 text-[13.5px] font-bold"
              >
                마이페이지에서 링크 추가하기
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5 items-start">
            {/* 좌측: shadcn/ui Chart 막대 그래프 */}
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-[15.5px] font-bold tracking-[-0.015em] text-[#191F28]">
                    링크별 클릭 분포
                  </h2>
                  <p className="text-[12px] text-[#8B95A1] mt-0.5">
                    클릭수가 높은 순서대로 정렬된 그래프예요
                  </p>
                </div>
                <Badge variant="count" className="px-2.5">
                  상위 {links.length}개
                </Badge>
              </div>

              <Separator className="mb-5" />

              <ChartContainer
                config={chartConfig}
                className="min-h-[260px] w-full aspect-[4/3] sm:aspect-[16/10]"
              >
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 24, right: 8, left: -12, bottom: 4 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    interval={0}
                    className="text-[11px] font-medium"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={36}
                    domain={[
                      0,
                      (dataMax: number) => Math.max(dataMax + 1, 4),
                    ]}
                    className="text-[11px]"
                  />
                  <ChartTooltip
                    cursor={{ fill: "#F2F4F6", radius: 8 }}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        labelFormatter={(_label, payload) => {
                          const first = payload?.[0]?.payload as
                            | { fullTitle?: string }
                            | undefined;
                          return first?.fullTitle ?? "";
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="clickCount"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={48}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.id} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="clickCount"
                      position="top"
                      offset={8}
                      className="fill-[#4E5968] text-[11px] font-bold"
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>

            {/* 우측: 링크별 클릭 순위 상세 리스트 */}
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-[15.5px] font-bold tracking-[-0.015em] text-[#191F28]">
                    클릭 순위 상세
                  </h2>
                  <p className="text-[12px] text-[#8B95A1] mt-0.5">
                    전체 클릭 대비 비중과 순위를 확인하세요
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="h-[22px] px-2.5 text-[11px] font-bold gap-1 text-[#3182F6] bg-[#E8F3FF] tabular-nums"
                >
                  <MousePointerClick className="w-3 h-3" aria-hidden="true" />
                  {totalClicks.toLocaleString()}
                </Badge>
              </div>

              <Separator className="mb-4" />

              <ul role="list" className="flex flex-col gap-3">
                {links.map((link, index) => {
                  const clicks =
                    typeof link.clickCount === "number" ? link.clickCount : 0;
                  const sharePercent =
                    totalClicks > 0
                      ? Math.round((clicks / totalClicks) * 100)
                      : 0;
                  const relativePercent =
                    maxClicks > 0 ? Math.round((clicks / maxClicks) * 100) : 0;
                  const isTopOne = index === 0 && clicks > 0;

                  return (
                    <li
                      key={link.id}
                      role="listitem"
                      className="rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span
                            className={cn(
                              "w-6 h-6 rounded-full text-[11.5px] font-extrabold flex items-center justify-center shrink-0 tabular-nums",
                              isTopOne
                                ? "bg-[#3182F6] text-white"
                                : "bg-[#E5E8EB]/80 text-[#4E5968]"
                            )}
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13.5px] font-bold text-[#191F28] truncate">
                              {link.title}
                            </p>
                            <p className="text-[11px] text-[#8B95A1] truncate">
                              {link.url}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[13.5px] font-extrabold text-[#191F28] tabular-nums">
                            {clicks.toLocaleString()}
                          </p>
                          <p className="text-[10.5px] font-semibold text-[#6B7684] tabular-nums">
                            {sharePercent}%
                          </p>
                        </div>
                      </div>

                      {/* 비중 프로그레스 바 (인라인 style 없이 Tailwind 클래스 사용) */}
                      <div className="h-1.5 w-full rounded-full bg-[#E5E8EB]/80 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isTopOne ? "bg-[#3182F6]" : "bg-[#84B6FA]",
                            getProgressWidthClass(relativePercent)
                          )}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        )}
      </main>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {displayUserName}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
      </footer>

      {/* ── 헤더 드롭다운과 연동된 프로필 수정 & 미리보기 모달 ── */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        currentBio={displayUserBio}
        currentPhotoURL={displayUserAvatar}
        onUpdateProfile={handleUpdateProfile}
      />

      <PreviewProfileDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        displayName={displayUserName}
        email={displayUserEmail}
        bio={displayUserBio}
        avatarUrl={displayUserAvatar}
        links={links}
        onCopyLink={handleCopyPageLink}
      />
    </div>
  );
}
