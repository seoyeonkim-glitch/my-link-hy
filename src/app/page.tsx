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
  limit,
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
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  // [TanStack Query - useQuery] 유저 프로필 정보 조회 (로그인 시 본인 프로필 동기화 / 비로그인 시 공개 프로필 읽기)
  const { data: userInfo } = useQuery<FirestoreUserInfo>({
    queryKey: ["users", user?.uid ?? "public", "profile"],
    enabled: !isAuthLoading,
    queryFn: async () => {
      // 1) 로그인 상태: 본인 users/{user.uid} 문서 조회 및 동기화
      if (user) {
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
      }

      // 2) 비로그인 상태: Firestore users 컬렉션에서 공개 프로필 읽기 (읽기는 누구나 가능)
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            displayName:
              data.displayName ||
              getEmailPrefix(data.email) ||
              DEFAULT_PROFILE_DATA.displayName,
            email: data.email || DEFAULT_PROFILE_DATA.socialLinks.email || "",
            photoURL: data.photoURL || DEFAULT_PROFILE_DATA.avatarUrl,
            bio: data.bio || DEFAULT_PROFILE_DATA.bio,
          };
        }
      } catch (error) {
        console.error("공개 프로필 읽기 실패:", error);
      }

      return {
        uid: "anonymous",
        displayName: DEFAULT_PROFILE_DATA.displayName,
        email: DEFAULT_PROFILE_DATA.socialLinks.email || "",
        photoURL: DEFAULT_PROFILE_DATA.avatarUrl,
        bio: DEFAULT_PROFILE_DATA.bio,
      };
    },
  });

  const targetUid = user?.uid || userInfo?.uid;

  // [TanStack Query - useQuery] Firestore(users/{targetUid}/links) 링크 목록 조회 (비로그인 상태에서도 읽기 가능)
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

      {/* ── 메인 영역 (로그인/비로그인 모두 읽기 가능, 쓰기는 로그인 시 활성화) ── */}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-5 items-start">
            {/* 좌측: 프로필 카드 (읽기는 누구나 가능, 프로필 수정 버튼은 로그인 시 노출) */}
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

            {/* 우측: 링크 목록 읽기 & (로그인 시) 링크 추가/수정/삭제 카드 */}
            <Card className="w-full pt-5 sm:pt-6">
              {user ? (
                <AddLinkDialog
                  onAddLink={handleAddLink}
                  isAdding={addLinkMutation.isPending}
                />
              ) : (
                /* 비로그인 상태 안내 배너: 읽기는 가능하며 추가·수정·삭제는 로그인 후 사용 가능 */
                <div className="mx-4 sm:mx-6 mb-4 rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-center sm:text-left">
                    <div className="w-8 h-8 rounded-full bg-[#E8F3FF] flex items-center justify-center shrink-0">
                      <Lock
                        className="w-4 h-4 text-[#3182F6]"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#191F28]">
                        링크 추가·수정·삭제는 로그인 이후에 사용할 수 있어요
                      </p>
                      <p className="text-[11.5px] text-[#6B7684]">
                        등록된 프로필과 링크 목록은 로그인 없이도 자유롭게 열람할 수 있어요.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isAuthActionLoading}
                    onClick={handleGoogleLogin}
                    className="h-9 rounded-full px-3.5 text-[12.5px] font-bold shrink-0 whitespace-nowrap"
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
                        Google 로그인
                      </>
                    )}
                  </Button>
                </div>
              )}

              <LinkListSection
                links={links}
                isLoading={isLinksLoading}
                isEditable={Boolean(user)}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
              />
            </Card>
          </div>
        )}
      </main>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-5 sm:mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {displayUserName}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
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
