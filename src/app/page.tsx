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
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  GoogleIcon,
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

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // [TanStack Query - useQuery] Firestore(users/{user.uid}) 유저 프로필 정보 조회 및 초기 동기화
  const { data: userInfo } = useQuery<FirestoreUserInfo>({
    queryKey: ["users", user?.uid, "profile"],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      if (!user) throw new Error("인증된 사용자가 없어요.");

      const emailPrefix = getEmailPrefix(user.email);
      const fallbackInfo: FirestoreUserInfo = {
        uid: user.uid,
        displayName:
          emailPrefix || user.displayName || DEFAULT_PROFILE_DATA.displayName,
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
        // 기존에 사용자가 수정·저장한 displayName이 있으면 우선 유지하고, 없을 때만 이메일 앞부분으로 초기화
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

  // [TanStack Query - useQuery] Firestore(users/{user.uid}/links) 링크 목록 조회
  const { data: links = [], isLoading: isLinksLoading } = useQuery<LinkItem[]>({
    queryKey: ["users", user?.uid, "links"],
    enabled: Boolean(user?.uid),
    queryFn: async () => {
      if (!user) return [];
      const linksRef = collection(db, "users", user.uid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
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

  // [TanStack Query - useMutation] 프로필 수정 (users/{user.uid}) — 낙관적 업데이트(Optimistic Update) 적용
  const updateProfileMutation = useMutation({
    mutationFn: async (values: {
      displayName: string;
      bio: string;
      photoURL: string;
    }) => {
      if (!user) throw new Error("로그인이 필요해요.");
      const now = new Date().toISOString();
      const nextPhotoURL =
        values.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          displayName: values.displayName,
          email: userInfo?.email || user.email || "",
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

      // 진행 중인 리페치 요청 취소 (낙관적 업데이트 값을 덮어쓰지 않도록 방지)
      await queryClient.cancelQueries({ queryKey: profileQueryKey });

      // 이전 프로필 캐시 스냅샷 보관 (롤백용)
      const previousProfile =
        queryClient.getQueryData<FirestoreUserInfo>(profileQueryKey);

      const nextPhotoURL =
        newValues.photoURL || user.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;

      // 캐시에 새 프로필 데이터를 즉시 낙관적으로 반영
      queryClient.setQueryData<FirestoreUserInfo>(profileQueryKey, (old) => ({
        uid: user.uid,
        displayName: newValues.displayName,
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
      // 에러 발생 시 이전 프로필 스냅샷으로 롤백
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
      queryClient.clear();
      toast.success("로그아웃됐어요 ✓");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.error("로그아웃에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  const handleCopyEmail = () => {
    const email =
      userInfo?.email ||
      user?.email ||
      DEFAULT_PROFILE_DATA.socialLinks.email ||
      "seoyeonkim@hanyang.ac.kr";
    navigator.clipboard.writeText(email);
    toast.success("이메일 복사됐어요 ✓");
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

  const handleCopyPageLink = () => {
    if (typeof window !== "undefined") {
      const targetUrl = user
        ? `${window.location.origin}/${encodeURIComponent(displayUserName)}`
        : window.location.href;
      navigator.clipboard.writeText(targetUrl);
      toast.success("내 페이지 링크가 복사됐어요 ✓");
    }
  };

  const handleShare = () => {
    const shareTitle = `${displayUserName} | MyLink`;
    const targetUrl =
      typeof window !== "undefined"
        ? user
          ? `${window.location.origin}/${encodeURIComponent(displayUserName)}`
          : window.location.href
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

  // Firestore(users 컬렉션)에서 displayName 중복 여부 확인 (본인 uid 제외)
  const handleCheckDisplayNameDuplicate = async (
    targetDisplayName: string
  ): Promise<boolean> => {
    const trimmed = targetDisplayName.trim();
    if (!trimmed) return false;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", trimmed));
    const snapshot = await getDocs(q);

    return snapshot.docs.some((docSnap) => docSnap.id !== user?.uid);
  };

  const handleUpdateProfile = async (values: {
    displayName: string;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
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

      {/* ── 메인 마이페이지 영역 (2열 가로 레이아웃) ── */}
      <main role="main" className="w-full max-w-[860px]">
        {isAuthLoading ? (
          /* ── 인증 상태 확인 중 로딩 화면 ── */
          <Card className="w-full px-6 py-14 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2
              className="w-7 h-7 text-[#3182F6] animate-spin"
              aria-hidden="true"
            />
            <p className="text-[13.5px] font-medium text-[#6B7684]">
              로그인 정보를 확인하고 있어요...
            </p>
          </Card>
        ) : user ? (
          /* ── 로그인 완료 상태: 좌측 프로필 카드 + 우측 링크 관리 2열 가로 레이아웃 ── */
          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-5 items-start">
            {/* 좌측: 내 프로필 카드 */}
            <Card className="w-full">
              <ProfileHeader
                displayName={displayUserName}
                email={displayUserEmail}
                bio={displayUserBio}
                avatarUrl={displayUserAvatar}
                onEditProfile={() => setIsEditProfileOpen(true)}
              />

              <ProfileActions
                onCopyEmail={handleCopyEmail}
                githubUrl={DEFAULT_PROFILE_DATA.socialLinks.github}
                blogUrl={DEFAULT_PROFILE_DATA.socialLinks.blog}
                portfolioUrl={DEFAULT_PROFILE_DATA.socialLinks.portfolio}
              />
            </Card>

            {/* 우측: 링크 추가 및 관리 카드 */}
            <Card className="w-full pt-5 sm:pt-6">
              <AddLinkDialog
                onAddLink={handleAddLink}
                isAdding={addLinkMutation.isPending}
              />

              <LinkListSection
                links={links}
                isLoading={isLinksLoading}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
              />
            </Card>
          </div>
        ) : (
          /* ── 비로그인 상태: 로그인 이후 사용 가능 안내 화면 ── */
          <Card className="w-full max-w-[460px] mx-auto">
            <section
              aria-label="로그인 안내"
              className="px-5 sm:px-7 py-8 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#E8F3FF] flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-[#3182F6]" aria-hidden="true" />
              </div>

              <h1 className="text-[19px] sm:text-[20px] font-bold leading-[1.35] tracking-[-0.015em] text-[#191F28] mb-2">
                로그인 이후에 사용할 수 있어요
              </h1>

              <p className="text-[13.5px] sm:text-[14px] font-normal leading-[1.6] text-[#4E5968] break-keep mb-5 px-2">
                구글 계정으로 로그인하면 나만의 마이페이지에서 프로필과 링크 목록을 직접 추가하고 관리할 수 있어요.
              </p>

              {/* 로그인 후 이용 가능한 기능 안내 카드 */}
              <div className="w-full rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB]/80 p-4 mb-5 text-left flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#3182F6] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-[12.5px] sm:text-[13px] font-medium text-[#4E5968] leading-[1.45]">
                    내 구글 계정(<code className="text-[#3182F6] font-semibold">users/&#123;uid&#125;/links</code>)으로 안전하게 개인화 저장돼요
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#3182F6] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-[12.5px] sm:text-[13px] font-medium text-[#4E5968] leading-[1.45]">
                    링크 추가, 수정, 삭제 기능을 실시간으로 이용할 수 있어요
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="default"
                size="lg"
                disabled={isAuthActionLoading}
                onClick={handleGoogleLogin}
                className="w-full h-[50px] rounded-[14px] text-[15px] font-bold"
              >
                {isAuthActionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                      <GoogleIcon className="w-3.5 h-3.5" />
                    </span>
                    Google 계정으로 시작하기
                  </>
                )}
              </Button>
            </section>
          </Card>
        )}
      </main>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-5 sm:mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {user ? displayUserName : "MyLink"}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
      </footer>

      {/* ── 프로필 수정 다이얼로그 (displayName 중복 확인 포함) ── */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        currentDisplayName={displayUserName}
        currentBio={displayUserBio}
        currentPhotoURL={displayUserAvatar}
        onCheckDisplayNameDuplicate={handleCheckDisplayNameDuplicate}
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
