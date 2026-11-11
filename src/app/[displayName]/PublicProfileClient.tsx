"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  FileText,
  Globe,
  Loader2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import NotFound from "@/app/not-found";
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
import { ProfileActions } from "@/components/profile/ProfileActions";
import { DEFAULT_PROFILE_DATA } from "@/constants";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { LinkIconType, LinkItem } from "@/types";

interface PublicUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
}

function getIconConfig(icon?: LinkIconType, url?: string) {
  switch (icon) {
    case "chart":
      return {
        Icon: BarChart3,
        badgeClassName: "bg-white text-[#10B981] border border-[#E5E8EB]",
      };
    case "file":
      return {
        Icon: FileText,
        badgeClassName: "bg-white text-[#6B7684] border border-[#E5E8EB]",
      };
    case "mail":
      return {
        Icon: Mail,
        badgeClassName: "bg-white text-[#8B5CF6] border border-[#E5E8EB]",
      };
    case "web":
    default:
      return {
        Icon: Globe,
        badgeClassName: cn(
          "bg-white text-[#3182F6] border border-[#E5E8EB]",
          url?.includes("github.com") && "text-[#191F28]"
        ),
      };
  }
}

export function PublicProfileClient() {
  const queryClient = useQueryClient();
  const params = useParams<{ displayName: string }>();
  const rawDisplayName = params?.displayName ?? "";
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  // 1. displayName으로 Firestore(users 컬렉션)에서 유저 검색
  const {
    data: targetUser,
    isLoading: isUserLoading,
    isFetched: isUserFetched,
  } = useQuery<PublicUserProfile | null>({
    queryKey: ["publicUser", decodedDisplayName],
    enabled: Boolean(decodedDisplayName),
    queryFn: async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", decodedDisplayName));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      const data = userDoc.data();

      return {
        uid: userDoc.id,
        displayName: data.displayName || decodedDisplayName,
        email: data.email || "",
        photoURL: data.photoURL || DEFAULT_PROFILE_DATA.avatarUrl,
        bio: data.bio || DEFAULT_PROFILE_DATA.bio,
      };
    },
  });

  // 2. 검색된 유저의 UID로 Firestore(users/{userId}/links)에서 링크 목록 조회
  const { data: links = [], isLoading: isLinksLoading } = useQuery<LinkItem[]>({
    queryKey: ["users", targetUser?.uid, "links"],
    enabled: Boolean(targetUser?.uid),
    queryFn: async () => {
      if (!targetUser?.uid) return [];
      const linksRef = collection(db, "users", targetUser.uid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: targetUser.uid,
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

  // 3. 방문자 링크 클릭 시 클릭 카운트 1 증가 (users/{userId}/links/{linkId}) — 낙관적 업데이트 적용
  const trackLinkClickMutation = useMutation({
    mutationFn: async ({
      ownerUid,
      linkId,
    }: {
      ownerUid: string;
      linkId: string;
    }) => {
      const linkDocRef = doc(db, "users", ownerUid, "links", linkId);
      await updateDoc(linkDocRef, {
        clickCount: increment(1),
      });
    },
    onMutate: async ({ ownerUid, linkId }) => {
      const linksQueryKey = ["users", ownerUid, "links"] as const;
      await queryClient.cancelQueries({ queryKey: linksQueryKey });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(linksQueryKey);

      queryClient.setQueryData<LinkItem[]>(linksQueryKey, (old) =>
        old?.map((item) =>
          item.id === linkId
            ? { ...item, clickCount: (item.clickCount ?? 0) + 1 }
            : item
        )
      );

      return { previousLinks, ownerUid };
    },
    onError: (error, _variables, context) => {
      console.error("링크 클릭 카운트 저장 실패:", error);
      if (context?.ownerUid && context?.previousLinks) {
        queryClient.setQueryData(
          ["users", context.ownerUid, "links"],
          context.previousLinks
        );
      }
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["users", variables.ownerUid, "links"],
      });
    },
  });

  // 유저 검색 중일 때 로딩 화면 표시
  if (isUserLoading || (!isUserFetched && Boolean(decodedDisplayName))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
        <Card className="w-full max-w-[420px] px-6 py-14 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2
            className="w-7 h-7 text-[#3182F6] animate-spin"
            aria-hidden="true"
          />
          <p className="text-[13.5px] font-medium text-[#6B7684]">
            <span className="font-bold text-[#191F28]">{decodedDisplayName}</span>
            님의 페이지를 불러오고 있어요...
          </p>
        </Card>
      </div>
    );
  }

  // 해당 displayName의 유저가 존재하지 않으면 404 페이지 렌더링
  if (!targetUser) {
    return <NotFound />;
  }

  const handleCopyEmail = () => {
    const email =
      targetUser.email ||
      DEFAULT_PROFILE_DATA.socialLinks.email ||
      "seoyeonkim@hanyang.ac.kr";
    navigator.clipboard.writeText(email);
    toast.success("이메일 복사됐어요 ✓");
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: `${targetUser.displayName} | MyLink`,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("페이지 링크가 복사됐어요 ✓");
    }
  };

  const handleTrackLinkClick = (linkId: string) => {
    trackLinkClickMutation.mutate({
      ownerUid: targetUser.uid,
      linkId,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
      <Card className="w-full max-w-[420px]">
        <main role="main">
          {/* 상단 헤더 영역 */}
          <header
            aria-label="프로필 정보"
            className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[15px] sm:text-[16px] font-extrabold tracking-[-0.02em] text-[#191F28] hover:opacity-80 transition-opacity"
              >
                MyLink
              </Link>

              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    tabIndex={-1}
                    className="h-9 rounded-full px-3.5 text-[12.5px] font-semibold text-[#4E5968] hover:text-[#191F28]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    마이페이지
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="iconCircle"
                  size="iconSm"
                  onClick={handleShare}
                  aria-label="프로필 공유하기"
                  title="프로필 링크 공유하기"
                >
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* 아바타 + displayName + 이메일 + 소개글 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3.5 rounded-full p-1 bg-gradient-to-tr from-[#E8F3FF] via-[#F2F4F6] to-[#E8F3FF] border border-[#E5E8EB]/80">
                <Avatar className="w-[76px] h-[76px] sm:w-[82px] sm:h-[82px]">
                  <AvatarImage
                    src={targetUser.photoURL}
                    alt={`${targetUser.displayName} 프로필 사진`}
                    fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                  />
                </Avatar>
                <span
                  className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#34C759] ring-2 ring-white"
                  aria-label="온라인"
                />
              </div>

              <h1 className="text-[19px] sm:text-[20px] font-bold leading-[1.3] tracking-[-0.015em] text-[#191F28] mb-0.5">
                {targetUser.displayName}
              </h1>

              {targetUser.email && (
                <p className="text-[12.5px] font-medium text-[#8B95A1] mb-2">
                  {targetUser.email}
                </p>
              )}

              <p className="text-[12.5px] sm:text-[13px] font-normal leading-[1.5] tracking-[-0.005em] text-[#6B7684] break-keep px-2">
                {targetUser.bio}
              </p>
            </div>
          </header>

          {/* 소셜 및 이메일 복사 퀵 액션 */}
          <ProfileActions
            onCopyEmail={handleCopyEmail}
            githubUrl={DEFAULT_PROFILE_DATA.socialLinks.github}
            blogUrl={DEFAULT_PROFILE_DATA.socialLinks.blog}
            portfolioUrl={DEFAULT_PROFILE_DATA.socialLinks.portfolio}
          />

          {/* 방문자용 링크 목록 (users/{userId}/links) */}
          <section
            aria-label="링크 목록"
            className="px-4 sm:px-6 pb-6 sm:pb-7 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] sm:text-[13.5px] font-bold tracking-[-0.01em] text-[#191F28]">
                  🔗 등록된 링크
                </h2>
                {isLinksLoading && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#3182F6]">
                    <Loader2
                      className="w-3.5 h-3.5 animate-spin"
                      aria-hidden="true"
                    />
                    불러오는 중...
                  </span>
                )}
              </div>
              <Badge variant="count">{links.length}</Badge>
            </div>

            <Separator />

            {isLinksLoading && links.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2.5 py-8 rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB]/80">
                <Loader2
                  className="w-6 h-6 text-[#3182F6] animate-spin"
                  aria-hidden="true"
                />
                <p className="text-[13px] font-medium text-[#6B7684]">
                  링크 목록을 불러오고 있어요...
                </p>
              </div>
            ) : links.length === 0 ? (
              <div className="py-8 text-center rounded-[16px] bg-[#F9FAFB] border border-dashed border-[#E5E8EB]">
                <p className="text-[13.5px] font-semibold text-[#4E5968] mb-1">
                  아직 등록된 링크가 없어요
                </p>
                <p className="text-[12px] text-[#8B95A1]">
                  {targetUser.displayName}님이 아직 링크를 등록하지 않았어요.
                </p>
              </div>
            ) : (
              <ul role="list" className="flex flex-col gap-2 sm:gap-2.5 pt-0.5">
                {links.map((link) => {
                  const { Icon, badgeClassName } = getIconConfig(
                    link.icon,
                    link.url
                  );
                  return (
                    <li key={link.id} role="listitem">
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleTrackLinkClick(link.id)}
                        className="block rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40"
                      >
                        <CardListRow className="justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(25,31,40,0.04)]",
                                badgeClassName
                              )}
                            >
                              <Icon className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate">
                                {link.title}
                              </CardTitle>
                              <CardDescription className="mt-0.5">
                                {link.description || link.url}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronRight
                            className="w-4 h-4 text-[#8B95A1] shrink-0"
                            aria-hidden="true"
                          />
                        </CardListRow>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>
      </Card>

      {/* 푸터 영역 */}
      <footer className="mt-5 sm:mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {targetUser.displayName}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
      </footer>
    </div>
  );
}
