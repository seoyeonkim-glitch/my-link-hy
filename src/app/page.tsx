"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "firebase/firestore";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toast } from "@/components/ui/toast";
import {
  GoogleIcon,
  ProfileHeader,
} from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { LinkListSection } from "@/components/profile/LinkListSection";
import { AddLinkDialog } from "@/components/profile/AddLinkDialog";
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

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<FirestoreUserInfo | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2000);
  };

  // Firestore(users/{user.uid}/links)에서 createdAt 기준 최신순(desc)으로 링크 불러오기
  const fetchLinks = useCallback(async (uid: string) => {
    setIsLoading(true);
    try {
      const linksRef = collection(db, "users", uid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const fetchedLinks: LinkItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: uid,
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

      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Firestore 링크 목록 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firestore(users/{user.uid})의 유저 정보를 동기화하고 화면에 표시할 유저 데이터 로드
  const syncAndFetchUserInfo = useCallback(async (currentUser: User) => {
    const fallbackInfo: FirestoreUserInfo = {
      uid: currentUser.uid,
      displayName:
        currentUser.displayName || DEFAULT_PROFILE_DATA.displayName,
      email: currentUser.email || "",
      photoURL: currentUser.photoURL || DEFAULT_PROFILE_DATA.avatarUrl,
      bio: DEFAULT_PROFILE_DATA.bio,
    };

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      const existingData = userSnap.exists() ? userSnap.data() : null;

      const mergedInfo: FirestoreUserInfo = {
        uid: currentUser.uid,
        displayName:
          currentUser.displayName ||
          existingData?.displayName ||
          fallbackInfo.displayName,
        email: currentUser.email || existingData?.email || "",
        photoURL:
          currentUser.photoURL ||
          existingData?.photoURL ||
          fallbackInfo.photoURL,
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

      setUserInfo(mergedInfo);
    } catch (error) {
      console.error("Firestore 유저 정보 동기화 실패:", error);
      setUserInfo(fallbackInfo);
    }
  }, []);

  // Firebase 인증 상태 감지 및 유저별 데이터 로드
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        await Promise.all([
          syncAndFetchUserInfo(currentUser),
          fetchLinks(currentUser.uid),
        ]);
      } else {
        setUserInfo(null);
        setLinks([]);
      }
    });

    return () => unsubscribe();
  }, [fetchLinks, syncAndFetchUserInfo]);

  // 구글 소셜 로그인 핸들러
  const handleGoogleLogin = async () => {
    setIsAuthActionLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("구글 계정으로 로그인됐어요 ✓");
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      showToast("로그인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    setIsAuthActionLoading(true);
    try {
      await signOut(auth);
      showToast("로그아웃됐어요 ✓");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      showToast("로그아웃에 실패했어요. 다시 시도해 주세요.");
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
    showToast("이메일 복사됐어요 ✓");
  };

  const handleShare = () => {
    const shareTitle = `${
      userInfo?.displayName ||
      user?.displayName ||
      DEFAULT_PROFILE_DATA.displayName
    } | MyLink`;

    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: shareTitle,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("링크 복사됐어요 ✓");
    }
  };

  // 링크 추가 시 Firestore(users/{user.uid}/links)에 저장 후 목록 즉시 갱신
  const handleAddLink = async (
    newLinkInput: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
  ) => {
    if (!user) {
      showToast("로그인 이후에 사용할 수 있어요.");
      return;
    }

    const now = new Date().toISOString();
    setIsAdding(true);

    try {
      const linksRef = collection(db, "users", user.uid, "links");
      await Promise.all([
        addDoc(linksRef, {
          title: newLinkInput.title,
          url: newLinkInput.url,
          createdAt: now,
        }),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      await fetchLinks(user.uid);
      showToast("새 링크가 저장됐어요 ✓");
    } catch (error) {
      console.error("Firestore 링크 저장 실패:", error);
      showToast("링크 저장에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsAdding(false);
    }
  };

  // 링크 수정 시 Firestore(users/{user.uid}/links/{id}) 업데이트 후 목록 갱신
  const handleUpdateLink = async (
    id: string,
    updatedValues: { title: string; url: string }
  ) => {
    if (!user) return;
    const now = new Date().toISOString();

    try {
      const linkDocRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(linkDocRef, {
        title: updatedValues.title,
        url: updatedValues.url,
        updatedAt: now,
      });

      await fetchLinks(user.uid);
      showToast("링크가 수정됐어요 ✓");
    } catch (error) {
      console.error("Firestore 링크 수정 실패:", error);
      showToast("링크 수정에 실패했어요. 다시 시도해 주세요.");
    }
  };

  // 링크 삭제 시 Firestore(users/{user.uid}/links/{id}) 삭제 후 목록 갱신
  const handleDeleteLink = async (id: string) => {
    if (!user) return;

    try {
      const linkDocRef = doc(db, "users", user.uid, "links", id);
      await deleteDoc(linkDocRef);

      await fetchLinks(user.uid);
      showToast("링크가 삭제됐어요 ✓");
    } catch (error) {
      console.error("Firestore 링크 삭제 실패:", error);
      showToast("링크 삭제에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const displayUserName =
    userInfo?.displayName ||
    user?.displayName ||
    DEFAULT_PROFILE_DATA.displayName;
  const displayUserEmail = userInfo?.email || user?.email || null;
  const displayUserAvatar =
    userInfo?.photoURL || user?.photoURL || DEFAULT_PROFILE_DATA.avatarUrl;
  const displayUserBio = userInfo?.bio || DEFAULT_PROFILE_DATA.bio;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
      {/* ── 메인 프로필 카드 (shadcn/ui Card × TDS 재사용 컴포넌트 조합) ── */}
      <Card className="w-full max-w-[420px]">
        <main role="main">
          <ProfileHeader
            displayName={displayUserName}
            email={displayUserEmail}
            bio={displayUserBio}
            avatarUrl={displayUserAvatar}
            isLoggedIn={Boolean(user)}
            isAuthActionLoading={isAuthActionLoading}
            onGoogleLogin={handleGoogleLogin}
            onLogout={handleLogout}
            onShare={handleShare}
          />

          {isAuthLoading ? (
            /* ── 인증 상태 확인 중 로딩 화면 ── */
            <div
              className="px-4 sm:px-6 pb-8 pt-4 flex flex-col items-center justify-center gap-3 text-center"
              role="status"
              aria-live="polite"
            >
              <Loader2
                className="w-7 h-7 text-[#3182F6] animate-spin"
                aria-hidden="true"
              />
              <p className="text-[13.5px] font-medium text-[#6B7684]">
                로그인 정보를 확인하고 있어요...
              </p>
            </div>
          ) : user ? (
            /* ── 로그인 완료 상태: 개인화된 유저 프로필 액션 및 링크 관리 화면 ── */
            <>
              <ProfileActions
                onCopyEmail={handleCopyEmail}
                githubUrl={DEFAULT_PROFILE_DATA.socialLinks.github}
                blogUrl={DEFAULT_PROFILE_DATA.socialLinks.blog}
                portfolioUrl={DEFAULT_PROFILE_DATA.socialLinks.portfolio}
              />

              <AddLinkDialog onAddLink={handleAddLink} isAdding={isAdding} />

              <LinkListSection
                links={links}
                isLoading={isLoading}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
              />
            </>
          ) : (
            /* ── 비로그인 상태: 로그인 이후 사용 가능 안내 화면 ── */
            <section
              aria-label="로그인 안내"
              className="px-4 sm:px-6 pb-7 pt-1 flex flex-col items-center text-center"
            >
              <Separator className="mb-6" />

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
          )}
        </main>
      </Card>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-5 sm:mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {user ? displayUserName : "MyLink"}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
      </footer>

      {/* ── 토스트 피드백 (shadcn/ui Toast) ── */}
      <Toast visible={Boolean(toastMessage)}>{toastMessage}</Toast>
    </div>
  );
}
