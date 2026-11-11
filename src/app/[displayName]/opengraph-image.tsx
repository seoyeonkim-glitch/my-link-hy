import { ImageResponse } from "next/og";
import {
  decodeDisplayName,
  fetchAvatarDataUri,
  fetchPublicProfileForOg,
  formatDisplayUrl,
  loadOgFonts,
  sanitizeOgText,
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
        width="20"
        height="20"
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
        width="20"
        height="20"
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
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  const isGithub =
    icon === "github" || Boolean(url && url.toLowerCase().includes("github.com"));

  return (
    <svg
      width="20"
      height="20"
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

/**
 * 동적 경로(/[displayName]) 전용 개인화 Open Graph 이미지
 * 참고: ImageResponse(Satori) 명세에 따라 Flexbox 기반 인라인 style 객체를 사용합니다.
 */
export default async function UserOpenGraphImage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName: rawDisplayName } = await params;
  const decodedHandle = decodeDisplayName(rawDisplayName) || "profile";

  const [fonts, profile] = await Promise.all([
    loadOgFonts(),
    fetchPublicProfileForOg(decodedHandle),
  ]);

  const displayNameText = sanitizeOgText(
    profile?.displayName || decodedHandle,
    20
  );
  const handleSlug = sanitizeOgText(decodedHandle, 22);
  const bioText = sanitizeOgText(
    profile?.bio || "나만의 링크를 한 곳에서 편하게 확인하고 연결해 보세요.",
    68
  );

  const avatarDataUri = profile?.photoURL
    ? await fetchAvatarDataUri(profile.photoURL)
    : null;

  const initialChar = (displayNameText.slice(0, 1) || "M").toUpperCase();

  const totalLinks = profile?.totalLinkCount ?? 0;
  const visibleLinks: OgPublicLink[] =
    profile && profile.links.length > 0 ? profile.links.slice(0, 3) : [];
  const remainingLinksCount = Math.max(0, totalLinks - visibleLinks.length);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F4F5F7",
          padding: "40px 44px",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            borderRadius: "32px",
            border: "1px solid #E5E8EB",
            boxShadow: "0 18px 48px rgba(25, 31, 40, 0.06)",
            overflow: "hidden",
          }}
        >
          {/* 상단 카드 헤더 바 */}
          <div
            style={{
              height: "74px",
              padding: "0 36px",
              borderBottom: "1px solid #E5E8EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: "#E8F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3182F6"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#191F28",
                  letterSpacing: "-0.02em",
                }}
              >
                MyLink
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#F2F4F6",
                  color: "#4E5968",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "7px 16px",
                  borderRadius: "999px",
                }}
              >
                {`/${handleSlug}`}
              </span>
              {totalLinks > 0 && (
                <span
                  style={{
                    backgroundColor: "#E8F3FF",
                    color: "#3182F6",
                    fontSize: "15px",
                    fontWeight: 700,
                    padding: "7px 16px",
                    borderRadius: "999px",
                  }}
                >
                  {`링크 ${totalLinks}개`}
                </span>
              )}
            </div>
          </div>

          {/* 중앙 2컬럼 프로필 + 링크 리스트 영역 */}
          <div
            style={{
              flex: 1,
              padding: "30px 36px",
              display: "flex",
              alignItems: "stretch",
              gap: "34px",
            }}
          >
            {/* 좌측 사용자 프로필 섹션 */}
            <div
              style={{
                width: "396px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: "32px",
                borderRight: "1px solid #E5E8EB",
              }}
            >
              {/* 아바타 + 온라인 그린 닷 */}
              <div
                style={{
                  width: "118px",
                  height: "118px",
                  borderRadius: "999px",
                  backgroundColor: "#E8F3FF",
                  border: "1px solid #D6E6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "106px",
                    height: "106px",
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
                      width={106}
                      height={106}
                      style={{
                        width: "106px",
                        height: "106px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "106px",
                        height: "106px",
                        borderRadius: "999px",
                        backgroundColor: "#E8F3FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "40px",
                        fontWeight: 700,
                        color: "#3182F6",
                      }}
                    >
                      {initialChar}
                    </div>
                  )}
                </div>

                {/* 온라인 상태 인디케이터 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    right: "4px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "999px",
                    backgroundColor: "#34C759",
                    border: "4px solid #FFFFFF",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: "20px",
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: "-0.025em",
                  color: "#191F28",
                }}
              >
                {displayNameText}
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#8B95A1",
                }}
              >
                {`@${handleSlug}`}
              </div>

              <div
                style={{
                  marginTop: "14px",
                  fontSize: "19px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "#4E5968",
                }}
              >
                {bioText}
              </div>
            </div>

            {/* 우측 등록된 링크 미리보기 섹션 */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#4E5968",
                  }}
                >
                  {visibleLinks.length > 0 ? "등록된 링크" : "프로필 안내"}
                </span>
                {remainingLinksCount > 0 && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#3182F6",
                    }}
                  >
                    {`+${remainingLinksCount}개 더 보기`}
                  </span>
                )}
              </div>

              {visibleLinks.length > 0 ? (
                visibleLinks.map((item, index) => {
                  const isFeatured = index === 0;
                  const titleText = sanitizeOgText(
                    item.title || "등록된 링크",
                    28
                  );
                  const subText =
                    formatDisplayUrl(item.url) ||
                    sanitizeOgText(item.description || "", 34);

                  return (
                    <div
                      key={item.id || `${index}-${titleText}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: isFeatured ? "#F4F8FF" : "#F9FAFB",
                        border: isFeatured
                          ? "1px solid #D6E6FF"
                          : "1px solid #E5E8EB",
                        borderRadius: "18px",
                        padding: "14px 18px",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
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
                            gap: "3px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
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
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#8B95A1",
                              }}
                            >
                              {subText}
                            </span>
                          )}
                        </div>
                      </div>

                      <svg
                        width="18"
                        height="18"
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
                })
              ) : (
                <div
                  style={{
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
                      backgroundColor: "#F4F8FF",
                      border: "1px solid #D6E6FF",
                      borderRadius: "18px",
                      padding: "16px 20px",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
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
                          gap: "3px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#191F28",
                          }}
                        >
                          {`${displayNameText}님의 모든 링크`}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#6B7684",
                          }}
                        >
                          대표 포트폴리오, SNS, 소개 페이지를 한눈에 확인해요
                        </span>
                      </div>
                    </div>
                    <svg
                      width="18"
                      height="18"
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
                      borderRadius: "18px",
                      padding: "16px 20px",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
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
                          gap: "3px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#191F28",
                          }}
                        >
                          원클릭 연락 및 소셜 연결
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#8B95A1",
                          }}
                        >
                          {`/${handleSlug} 프로필에서 바로 소통할 수 있어요`}
                        </span>
                      </div>
                    </div>
                    <svg
                      width="18"
                      height="18"
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

          {/* 하단 푸터 바 */}
          <div
            style={{
              height: "58px",
              padding: "0 36px",
              backgroundColor: "#F9FAFB",
              borderTop: "1px solid #E5E8EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#6B7684",
              }}
            >
              MyLink에서 모든 링크를 한눈에 확인해 보세요
            </span>

            <div
              style={{
                backgroundColor: "#3182F6",
                color: "#FFFFFF",
                borderRadius: "999px",
                padding: "8px 18px",
                fontSize: "15px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>프로필 방문하기</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
