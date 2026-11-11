import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og";

export const alt = "MyLink — 나만의 모든 링크를 단 하나의 페이지에";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * 일반 경로(/, /stats 등)에 공통으로 적용되는 정적 Open Graph 이미지
 * 참고: ImageResponse(Satori) 명세에 따라 Flexbox 기반 인라인 style 객체를 사용합니다.
 */
export default async function OpenGraphImage() {
  const fonts = await loadOgFonts();

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
          padding: "44px",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundColor: "#FFFFFF",
            borderRadius: "32px",
            border: "1px solid #E5E8EB",
            boxShadow: "0 18px 44px rgba(25, 31, 40, 0.06)",
            overflow: "hidden",
          }}
        >
          {/* 좌측 서비스 소개 및 타이포그래피 영역 */}
          <div
            style={{
              width: "630px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "48px 44px 46px 52px",
            }}
          >
            {/* 상단 브랜드 락업 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  backgroundColor: "#E8F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
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
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#191F28",
                  letterSpacing: "-0.02em",
                }}
              >
                MyLink
              </span>
              <span
                style={{
                  marginLeft: "4px",
                  backgroundColor: "#E8F3FF",
                  color: "#3182F6",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: "999px",
                }}
              >
                링크 인 바이오
              </span>
            </div>

            {/* 중앙 히어로 헤드라인 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "58px",
                  fontWeight: 700,
                  lineHeight: 1.14,
                  letterSpacing: "-0.03em",
                  color: "#191F28",
                }}
              >
                <span>Every Link in</span>
                <span style={{ color: "#3182F6" }}>One Link.</span>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "21px",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: "#4E5968",
                }}
              >
                <span>GitHub, 블로그, 포트폴리오까지.</span>
                <span>나만의 링크를 한 페이지에 담아 공유해 보세요.</span>
              </div>
            </div>

            {/* 하단 기능 요약 칩 */}
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
                  padding: "9px 16px",
                  borderRadius: "999px",
                }}
              >
                간편한 링크 관리
              </span>
              <span
                style={{
                  backgroundColor: "#F2F4F6",
                  color: "#4E5968",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "9px 16px",
                  borderRadius: "999px",
                }}
              >
                맞춤 프로필 공유
              </span>
              <span
                style={{
                  backgroundColor: "#F2F4F6",
                  color: "#4E5968",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "9px 16px",
                  borderRadius: "999px",
                }}
              >
                클릭 통계 분석
              </span>
            </div>
          </div>

          {/* 우측 카드 목업 일러스트 영역 (Satori 회전 시 SVG 왜곡 방지를 위해 회전된 카드 내부는 순수 도형/텍스트로 구성) */}
          <div
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: "#F9FAFB",
              borderLeft: "1px solid #E5E8EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "36px",
            }}
          >
            <div
              style={{
                width: "356px",
                backgroundColor: "#FFFFFF",
                borderRadius: "26px",
                border: "1px solid #E5E8EB",
                boxShadow: "0 20px 44px rgba(25, 31, 40, 0.08)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transform: "rotate(-2deg)",
              }}
            >
              {/* 목업 상단 헤더 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: "#34C759",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#191F28",
                    }}
                  >
                    MyLink
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#3182F6",
                    backgroundColor: "#E8F3FF",
                    padding: "4px 10px",
                    borderRadius: "999px",
                  }}
                >
                  /my-profile
                </span>
              </div>

              {/* 목업 추상 프로필 헤더 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
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
                      width: "16px",
                      height: "16px",
                      borderRadius: "999px",
                      backgroundColor: "#3182F6",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "118px",
                      height: "13px",
                      borderRadius: "999px",
                      backgroundColor: "#191F28",
                    }}
                  />
                  <div
                    style={{
                      width: "178px",
                      height: "10px",
                      borderRadius: "999px",
                      backgroundColor: "#E5E8EB",
                    }}
                  />
                </div>
              </div>

              {/* 목업 링크 리스트 */}
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
                    backgroundColor: "#F4F8FF",
                    border: "1px solid #D6E6FF",
                    borderRadius: "16px",
                    padding: "13px 15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "999px",
                        backgroundColor: "#3182F6",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#191F28",
                      }}
                    >
                      GitHub 오픈소스
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#3182F6",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D6E6FF",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    HOT
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E8EB",
                    borderRadius: "16px",
                    padding: "13px 15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "999px",
                        backgroundColor: "#8B95A1",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#4E5968",
                      }}
                    >
                      포트폴리오 노션
                    </span>
                  </div>
                  <span
                    style={{
                      width: "34px",
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: "#E5E8EB",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E8EB",
                    borderRadius: "16px",
                    padding: "13px 15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "999px",
                        backgroundColor: "#10B981",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#4E5968",
                      }}
                    >
                      실시간 클릭 통계
                    </span>
                  </div>
                  <span
                    style={{
                      width: "26px",
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: "#E5E8EB",
                    }}
                  />
                </div>
              </div>

              {/* 목업 하단 단일 Blue CTA */}
              <div
                style={{
                  marginTop: "2px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#3182F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Google로 시작하기
              </div>
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
