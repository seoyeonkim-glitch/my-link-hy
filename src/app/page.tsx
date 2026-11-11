"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { LandingSections } from "@/components/landing/LandingSections";
import {
  MyPageTopBar,
  ProfileHeader,
} from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { LinkListSection } from "@/components/profile/LinkListSection";
import { AddLinkDialog } from "@/components/profile/AddLinkDialog";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { PreviewProfileDialog } from "@/components/profile/PreviewProfileDialog";
import { DEFAULT_PROFILE_DATA } from "@/constants";
import { auth, db, googleProvider } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { LinkItem } from "@/types";

interface FirestoreUserInfo {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
}

// 이메일 주소에서 '@' 앞부분(아이디)을 추출하여 초기 displayName으로 사용
const getEmailPrefix = (email?: string | null) =>
  email ? email.split("@")[0] : "";

export default function HomePage() {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLandingPreview, setIsLandingPreview] = useState(false);

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // [TanStack Query - useQuery] 로그인한 본인 프로필(users/{user.uid}) 조회 및 동기화
  const { data: userInfo } = useQuery<FirestoreUserInfo | null>({
    queryKey: ["users", user?.uid, "profile"],
    enabled: !isAuthLoading && Boolean(user),
    queryFn: async () => {
      if (!user) return null;

      const emailPrefix = getEmailPrefix(user.email);
      const fallbackInfo: FirestoreUserInfo = {
        uid: user.uid,
        displayName:
          emailPrefix ||
          user.displayName ||
          DEFAULT_PROFILE_DATA.displayName,
        email: user.email || "",
        photoURL: user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl,
        bio: DEFAULT_PROFILE_DATA.bio,
      };

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      const existingData = userSnap.exists() ? userSnap.data() : null;
      const resolvedEmail = user.email || existingData?.email || "";

      const mergedInfo: FirestoreUserInfo = {
        uid: user.uid,
        displayName:
          existingData?.displayName ||
          getEmailPrefix(resolvedEmail) ||
          user.displayName ||
          fallbackInfo.displayName,
        email: resolvedEmail,
        photoURL:
          existingData?.photoURL || user.photoURL || fallbackInfo.photoURL,
        bio: existingData?.bio || DEFAULT_PROFILE_DATA.bio,
      };

      await setDoc(
        userDocRef,
        {
          ...mergedInfo,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return mergedInfo;
    },
  });

  const targetUid = user?.uid;

  // [TanStack Query - useQuery] 로그인한 사용자의 링크 목록(users/{targetUid}/links) 조회
  const { data: links = [], isLoading: isLinksLoading } = useQuery<LinkItem[]>({
    queryKey: ["users", targetUid, "links"],
    enabled: !isAuthLoading && Boolean(targetUid),
    queryFn: async () => {
      if (!targetUid) return [];
      const linksRef = collection(db, "users", targetUid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: targetUid,
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

  // [TanStack Query - useMutation] 새 링크 추가 (users/{user.uid}/links)
  const addLinkMutation = useMutation({
    mutationFn: async (
      newLinkInput: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
    ) => {
      if (!user) throw new Error("로그인이 필요해요.");
      const now = new Date().toISOString();
      const linksRef = collection(db, "users", user.uid, "links");

      await Promise.all([
        addDoc(linksRef, {
          title: newLinkInput.title,
          url: newLinkInput.url,
          clickCount: newLinkInput.clickCount ?? 0,
          createdAt: now,
        }),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ["users", user.uid, "links"],
        });
      }
      toast.success("새 링크가 저장됐어요 ✓");
    },
    onError: (error) => {
      console.error("Firestore 링크 저장 실패:", error);
      toast.error("링크 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });

  // [TanStack Query - useMutation] 링크 수정 (users/{user.uid}/links/{id})
  const updateLinkMutation = useMutation({
    mutationFn: async ({
      id,
      updatedValues,
    }: {
      id: string;
      updatedValues: { title: string; url: string };
    }) => {
      if (!user) throw new Error("로그인이 필요해요.");
      const now = new Date().toISOString();
      const linkDocRef = doc(db, "users", user.uid, "links", id);

      await updateDoc(linkDocRef, {
        title: updatedValues.title,
        url: updatedValues.url,
        updatedAt: now,
      });
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ["users", user.uid, "links"],
        });
      }
      toast.success("링크가 수정됐어요 ✓");
    },
    onError: (error) => {
      console.error("Firestore 링크 수정 실패:", error);
      toast.error("링크 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });

  // [TanStack Query - useMutation] 링크 삭제 (users/{user.uid}/links/{id})
  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("로그인이 필요해요.");
      const linkDocRef = doc(db, "users", user.uid, "links", id);
      await deleteDoc(linkDocRef);
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ["users", user.uid, "links"],
        });
      }
      toast.success("링크가 삭제됐어요 ✓");
    },
    onError: (error) => {
      console.error("Firestore 링크 삭제 실패:", error);
      toast.error("링크 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });

  // [TanStack Query - useMutation] 링크 클릭 카운트 증가 (users/{ownerUid}/links/{linkId}) — 낙관적 업데이트 적용
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
      console.error("Firestore 링크 클릭 카운트 저장 실패:", error);
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

  // [TanStack Query - useMutation] 프로필 수정 (users/{user.uid}) — 낙관적 업데이트(Optimistic Update) 적용
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
        queryClient.getQueryData<FirestoreUserInfo>(profileQueryKey);

      const nextPhotoURL =
        newValues.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;

      queryClient.setQueryData<FirestoreUserInfo>(profileQueryKey, (old) => ({
        uid: user.uid,
        displayName: old?.displayName || displayUserName,
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

  // 구글 소셜 로그인 핸들러
  const handleGoogleLogin = async () => {
    setIsAuthActionLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("구글 계정으로 로그인됐어요 ✓");
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      toast.error("로그인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    setIsAuthActionLoading(true);
    try {
      await signOut(auth);
      setIsLandingPreview(false);
      queryClient.clear();
      toast.success("로그아웃됐어요 ✓");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.error("로그아웃에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  const displayUserEmail = userInfo?.email || user?.email || null;
  const displayUserName =
    userInfo?.displayName ||
    getEmailPrefix(displayUserEmail) ||
    user?.displayName ||
    DEFAULT_PROFILE_DATA.displayName;
  const displayUserAvatar =
    userInfo?.photoURL || user?.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;
  const displayUserBio = userInfo?.bio || DEFAULT_PROFILE_DATA.bio;

  const handleCopyEmail = () => {
    const email =
      displayUserEmail ||
      DEFAULT_PROFILE_DATA.socialLinks.email ||
      "seoyeonkim@hanyang.ac.kr";
    navigator.clipboard.writeText(email);
    toast.success("이메일 복사됐어요 ✓");
  };

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
    const isLandingShare = !user || isLandingPreview;
    const shareTitle = isLandingShare
      ? "MyLink | Every Link in One Link."
      : `${displayUserName} | MyLink`;
    const targetUrl =
      typeof window !== "undefined"
        ? isLandingShare
          ? window.location.origin
          : `${window.location.origin}/${encodeURIComponent(displayUserName)}`
        : "";

    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: shareTitle,
        url: targetUrl,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(targetUrl);
      toast.success(
        isLandingShare
          ? "마이링크 서비스 주소가 복사됐어요 ✓"
          : "내 페이지 링크가 복사됐어요 ✓"
      );
    }
  };

  const handleUpdateProfile = async (values: {
    bio: string;
    photoURL: string;
  }) => {
    await updateProfileMutation.mutateAsync(values);
  };

  const handleAddLink = async (
    newLinkInput: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
  ) => {
    await addLinkMutation.mutateAsync(newLinkInput);
  };

  const handleUpdateLink = async (
    id: string,
    updatedValues: { title: string; url: string }
  ) => {
    await updateLinkMutation.mutateAsync({ id, updatedValues });
  };

  const handleDeleteLink = async (id: string) => {
    await deleteLinkMutation.mutateAsync(id);
  };

  const handleTrackLinkClick = (linkId: string) => {
    if (!targetUid || targetUid === "anonymous") return;
    trackLinkClickMutation.mutate({ ownerUid: targetUid, linkId });
  };

  const isShowingLanding = !isAuthLoading && (!user || isLandingPreview);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10",
        !isShowingLanding && "justify-center"
      )}
    >
      {/* ── 상단 마이페이지 헤더 바 (가로형) ── */}
      <MyPageTopBar
        displayName={displayUserName}
        email={displayUserEmail}
        avatarUrl={displayUserAvatar}
        isLoggedIn={Boolean(user)}
        isAuthActionLoading={isAuthActionLoading}
        onGoogleLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onPreviewPage={() => setIsPreviewOpen(true)}
        onCopyPageLink={handleCopyPageLink}
        onShare={handleShare}
      />

      {/* ── 메인 영역: 비로그인 시 깔끔한 서비스 랜딩 페이지 / 로그인 시 내 링크 관리 워크스페이스 ── */}
      <main role="main" className="w-full max-w-[860px]">
        {isAuthLoading ? (
          <Card className="w-full px-6 py-14 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2
              className="w-7 h-7 text-[#3182F6] animate-spin"
              aria-hidden="true"
            />
            <p className="text-[13.5px] font-medium text-[#6B7684]">
              페이지를 불러오고 있어요...
            </p>
          </Card>
        ) : isShowingLanding ? (
          <LandingSections
            isAuthActionLoading={isAuthActionLoading}
            isLoggedInPreview={Boolean(user && isLandingPreview)}
            onGoogleLogin={handleGoogleLogin}
            onExitPreview={() => setIsLandingPreview(false)}
          />
        ) : (
          /* ── 로그인 시: 내 프로필 카드 + 링크 추가/수정/삭제 워크스페이스 ── */
          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-5 items-start">
            <Card className="w-full">
              <ProfileHeader
                displayName={displayUserName}
                email={displayUserEmail}
                bio={displayUserBio}
                avatarUrl={displayUserAvatar}
                isLoggedIn={Boolean(user)}
                onEditProfile={() => setIsEditProfileOpen(true)}
              />

              <ProfileActions
                onCopyEmail={handleCopyEmail}
                githubUrl={DEFAULT_PROFILE_DATA.socialLinks.github}
                blogUrl={DEFAULT_PROFILE_DATA.socialLinks.blog}
                portfolioUrl={DEFAULT_PROFILE_DATA.socialLinks.portfolio}
              />
            </Card>

            <Card className="w-full pt-5 sm:pt-6">
              <AddLinkDialog
                onAddLink={handleAddLink}
                isAdding={addLinkMutation.isPending}
              />

              <LinkListSection
                links={links}
                isLoading={isLinksLoading}
                isEditable={Boolean(user)}
                onLinkClick={handleTrackLinkClick}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
              />
            </Card>
          </div>
        )}
      </main>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-6 sm:mt-8 flex flex-col items-center gap-1">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {isShowingLanding ? "MyLink" : displayUserName}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
        {user && !isLandingPreview && (
          <button
            type="button"
            onClick={() => setIsLandingPreview(true)}
            className="mt-1 text-[11.5px] font-semibold text-[#6B7684] hover:text-[#3182F6] underline-offset-4 hover:underline transition-colors cursor-pointer"
          >
            비로그인 랜딩 화면 미리보기
          </button>
        )}
      </footer>

      {/* ── 프로필 수정 다이얼로그 (한 줄 소개, 프로필 사진) ── */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        currentBio={displayUserBio}
        currentPhotoURL={displayUserAvatar}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* ── 내 페이지 미리보기 다이얼로그 (Base UI Dialog) ── */}
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
