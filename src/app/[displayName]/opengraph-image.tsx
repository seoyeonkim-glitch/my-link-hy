import { ImageResponse } from "next/og";
import {
  decodeDisplayName,
  fetchAvatarDataUri,
  fetchPublicProfileForOg,
  formatDisplayUrl,
  loadOgFonts,
  sanitizeOgText,
  type OgFontDefinition,
  type OgPublicLink,
} from "@/lib/og";
import type { LinkIconType } from "@/types";

export const alt = "MyLink 사용자 프로필 페이지";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function renderLinkIconSvg(icon?: LinkIconType, url?: string) {
  if (icon === "chart") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10B981"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    );
  }

  if (icon === "file") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B7684"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    );
  }

  if (icon === "mail") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  const isGithub =
    icon === "github" || Boolean(url && url.toLowerCase().includes("github.com"));

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isGithub ? "#191F28" : "#3182F6"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

interface DynamicOgRenderData {
  displayNameText: string;
  handleSlug: string;
  bioText: string;
  initialChar: string;
  avatarDataUri: string | null;
  totalLinks: number;
  visibleLinks: OgPublicLink[];
  remainingLinksCount: number;
}

/**
 * 정적 OG 이미지(src/app/opengraph-image.tsx)와 동일한 Satori Flexbox 문법·디자인 시스템
 * (#F4F5F7 캔버스 + 상단 MyPageTopBar + 중앙 화이트 Hero 카드 + 우측 상승 카드 미리보기)으로
 * 동적 사용자 프로필 카드를 렌더링합니다.
 */
function buildDynamicOgElement({
  displayNameText,
  handleSlug,
  bioText,
  initialChar,
  avatarDataUri,
  totalLinks,
  visibleLinks,
  remainingLinksCount,
}: DynamicOgRenderData) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#F4F5F7",
        padding: "24px 64px",
        fontFamily: "Pretendard",
      }}
    >
      {/* 실제 서비스 상단 바 (정적 OG 이미지와 통일된 MyPageTopBar) */}
      <div
        style={{
          width: "100%",
          height: "52px",
          borderRadius: "18px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E8EB",
          padding: "0 24px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "19px",
            fontWeight: 700,
            color: "#191F28",
            letterSpacing: "-0.02em",
          }}
        >
          MyLink
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              height: "32px",
              borderRadius: "999px",
              backgroundColor: "#F2F4F6",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "#4E5968",
            }}
          >
            {`/${handleSlug}`}
          </div>

          {totalLinks > 0 && (
            <div
              style={{
                height: "32px",
                borderRadius: "999px",
                backgroundColor: "#E8F3FF",
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "#3182F6",
              }}
            >
              {`링크 ${totalLinks}개`}
            </div>
          )}

          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              backgroundColor: "#F2F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E5968"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>

      {/* 메인 화이트 카드 (정적 OG 카드와 동일한 라운딩·보더·그림자) */}
      <div
        style={{
          width: "100%",
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: "28px",
          border: "1px solid #E5E8EB",
          boxShadow: "0 14px 36px rgba(25, 31, 40, 0.05)",
          padding: "36px 44px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "38px",
          overflow: "hidden",
        }}
      >
        {/* 좌측 프로필 히어로 섹션 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {/* 상단 브랜드 배지 (#E8F3FF + 스파클 아이콘 + 활성 그린 도트) */}
          <div
            style={{
              height: "30px",
              borderRadius: "999px",
              backgroundColor: "#E8F3FF",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "18px",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3182F6"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#3182F6",
              }}
            >
              MyLink 프로필
            </span>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "#34C759",
              }}
            />
          </div>

          {/* 아바타 + 사용자 이름 & 핸들 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "16px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "999px",
                backgroundColor: "#E8F3FF",
                border: "1px solid #D6E6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "74px",
                  height: "74px",
                  borderRadius: "999px",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {avatarDataUri ? (
                  <img
                    src={avatarDataUri}
                    alt=""
                    width={74}
                    height={74}
                    style={{
                      width: "74px",
                      height: "74px",
                      borderRadius: "999px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "74px",
                      height: "74px",
                      borderRadius: "999px",
                      backgroundColor: "#E8F3FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px",
                      fontWeight: 700,
                      color: "#3182F6",
                    }}
                  >
                    {initialChar}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#191F28",
                }}
              >
                {displayNameText}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#8B95A1",
                }}
              >
                {`@${handleSlug}`}
              </span>
            </div>
          </div>

          {/* 한 줄 소개 */}
          <div
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#6B7684",
              marginBottom: "24px",
              display: "flex",
            }}
          >
            {bioText}
          </div>

          {/* 단일 Blue Primary CTA 버튼 (정적 OG와 동일 46px·14px radius) */}
          <div
            style={{
              height: "46px",
              borderRadius: "14px",
              backgroundColor: "#3182F6",
              padding: "0 22px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              프로필 방문하기
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 우측 링크 미리보기 카드 (정적 OG 하단 미니 카드 일러스트와 통일된 스타일) */}
        <div
          style={{
            width: "438px",
            borderRadius: "22px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E8EB",
            boxShadow: "0 14px 34px rgba(25, 31, 40, 0.06)",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#4E5968",
              }}
            >
              {visibleLinks.length > 0 ? "등록된 링크" : "프로필 안내"}
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: remainingLinksCount > 0 ? "#3182F6" : "#8B95A1",
              }}
            >
              {remainingLinksCount > 0
                ? `+${remainingLinksCount}개 더 보기`
                : `/${handleSlug}`}
            </span>
          </div>

          {visibleLinks.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {visibleLinks.map((item, index) => {
                const isFeatured = index === 0;
                const titleText = sanitizeOgText(
                  item.title || "등록된 링크",
                  24
                );
                const subText =
                  formatDisplayUrl(item.url) ||
                  sanitizeOgText(item.description || "", 30);

                return (
                  <div
                    key={item.id || `${index}-${titleText}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: isFeatured ? "#E8F3FF" : "#F9FAFB",
                      border: isFeatured
                        ? "1px solid #D6E6FF"
                        : "1px solid #E5E8EB",
                      borderRadius: "14px",
                      padding: "12px 14px",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          backgroundColor: "#FFFFFF",
                          border: isFeatured
                            ? "1px solid #D6E6FF"
                            : "1px solid #E5E8EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {renderLinkIconSvg(item.icon, item.url)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#191F28",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {titleText}
                        </span>
                        {subText && (
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 400,
                              color: isFeatured ? "#4E5968" : "#8B95A1",
                            }}
                          >
                            {subText}
                          </span>
                        )}
                      </div>
                    </div>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isFeatured ? "#3182F6" : "#8B95A1"}
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#E8F3FF",
                  border: "1px solid #D6E6FF",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D6E6FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {renderLinkIconSvg("web")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#191F28",
                      }}
                    >
                      {`${displayNameText}님의 모든 링크`}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#4E5968",
                      }}
                    >
                      포트폴리오, 블로그, SNS를 한 페이지에서 확인해요
                    </span>
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3182F6"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E8EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {renderLinkIconSvg("mail")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#191F28",
                      }}
                    >
                      원클릭 링크 이동 및 공유
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#8B95A1",
                      }}
                    >
                      {`/${handleSlug} 링크를 통해 바로 연결해 보세요`}
                    </span>
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B95A1"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 동적 경로(/[displayName]) 전용 개인화 Open Graph 이미지
 * 참고: Next.js 16 파일 컨벤션과 ImageResponse(Satori) 명세를 따르며,
 * 아바타/폰트 로딩 실패 시에도 안전한 폴백 PNG를 반환해 500 오류를 방지합니다.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName: rawDisplayName } = await params;
  const decodedHandle = decodeDisplayName(rawDisplayName) || "profile";

  const [fonts, profile] = await Promise.all([
    loadOgFonts().catch(() => [] as OgFontDefinition[]),
    fetchPublicProfileForOg(decodedHandle).catch(() => null),
  ]);

  const displayNameText = sanitizeOgText(
    profile?.displayName || decodedHandle,
    20
  );
  const handleSlug = sanitizeOgText(decodedHandle, 22);
  const bioText = sanitizeOgText(
    profile?.bio || "나만의 링크를 한 곳에서 편하게 확인하고 연결해 보세요.",
    64
  );
  const initialChar = (displayNameText.slice(0, 1) || "M").toUpperCase();

  const totalLinks = profile?.totalLinkCount ?? 0;
  const visibleLinks: OgPublicLink[] =
    profile && profile.links.length > 0 ? profile.links.slice(0, 3) : [];
  const remainingLinksCount = Math.max(0, totalLinks - visibleLinks.length);

  const avatarDataUri = profile?.photoURL
    ? await fetchAvatarDataUri(profile.photoURL).catch(() => null)
    : null;

  const baseData: DynamicOgRenderData = {
    displayNameText,
    handleSlug,
    bioText,
    initialChar,
    avatarDataUri,
    totalLinks,
    visibleLinks,
    remainingLinksCount,
  };

  const imageOptions = fonts.length > 0 ? { ...size, fonts } : { ...size };

  try {
    const res = new ImageResponse(
      buildDynamicOgElement(baseData),
      imageOptions
    );
    const pngBuffer = await res.arrayBuffer();
    return new Response(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store",
      },
    });
  } catch {
    // 아바타 이미지 디코딩 등 예외 발생 시 모노그램 폴백으로 안전 렌더링
    return new ImageResponse(
      buildDynamicOgElement({
        ...baseData,
        avatarDataUri: null,
      }),
      imageOptions
    );
  }
}
