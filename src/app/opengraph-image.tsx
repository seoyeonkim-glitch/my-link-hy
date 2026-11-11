import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og";

export const alt = "MyLink — Every Link in One Link.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * 일반 경로(/, /stats 등)에 공통으로 적용되는 정적 Open Graph 이미지
 * 실제 루트(/) 랜딩 페이지의 상단 바 + 중앙 정렬 히어로 카드 + 추상화된 기울어진 미니 카드 일러스트와 통일감 있게 구성합니다.
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
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#F4F5F7",
          padding: "24px 64px",
          fontFamily: "Pretendard",
        }}
      >
        {/* 실제 서비스 상단 바 (MyPageTopBar) */}
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
              로그인
            </div>
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

        {/* 중앙 정렬 랜딩 히어로 카드 */}
        <div
          style={{
            width: "100%",
            flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: "28px",
            border: "1px solid #E5E8EB",
            boxShadow: "0 14px 36px rgba(25, 31, 40, 0.05)",
            padding: "28px 40px 24px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          {/* 상단 브랜드 배지 */}
          <div
            style={{
              height: "30px",
              borderRadius: "999px",
              backgroundColor: "#E8F3FF",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "14px",
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
              나만의 링크를 한 곳에
            </span>
          </div>

          {/* 메인 히어로 헤드라인 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "52px",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#191F28",
              marginBottom: "12px",
            }}
          >
            <span>Every Link in</span>
            <span style={{ color: "#3182F6" }}>One Link.</span>
          </div>

          {/* 서브 카피 (2줄 중앙 정렬) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#6B7684",
              marginBottom: "18px",
            }}
          >
            <span>GitHub, 블로그, 포트폴리오까지.</span>
            <span>흩어진 모든 링크를 깔끔한 한 페이지에 담아보세요.</span>
          </div>

          {/* 단일 Blue Primary CTA 버튼 */}
          <div
            style={{
              height: "46px",
              borderRadius: "14px",
              backgroundColor: "#3182F6",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "999px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              Google로 시작하기
            </span>
          </div>

          {/* 추상화된 MyLink 미니 카드 일러스트 (LandingSections 히어로 하단과 동일 구조) */}
          <div
            style={{
              width: "390px",
              borderRadius: "22px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E8EB",
              boxShadow: "0 14px 34px rgba(25, 31, 40, 0.06)",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              transform: "rotate(-2deg)",
            }}
          >
            {/* 추상 프로필 헤더 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  backgroundColor: "#F2F4F6",
                  border: "1px solid #E5E8EB",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "102px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#E5E8EB",
                  }}
                />
                <div
                  style={{
                    width: "152px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: "#F2F4F6",
                  }}
                />
              </div>
            </div>

            {/* 추상 링크 행 3개 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#E8F3FF",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#3182F6",
                  }}
                />
                <div
                  style={{
                    width: "140px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(49, 130, 246, 0.3)",
                  }}
                />
                <div
                  style={{
                    marginLeft: "auto",
                    width: "36px",
                    height: "14px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  }}
                />
              </div>

              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#CBD5E1",
                  }}
                />
                <div
                  style={{
                    width: "108px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#E5E8EB",
                  }}
                />
              </div>

              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#CBD5E1",
                  }}
                />
                <div
                  style={{
                    width: "126px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#E5E8EB",
                  }}
                />
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
