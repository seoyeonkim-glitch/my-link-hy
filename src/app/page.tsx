"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 40%, #261c52 0%, #130d2a 60%, #090615 100%)",
        color: "#ffffff",
      }}
    >
      {/* 프로필 카드 */}
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "rgba(25, 20, 52, 0.78)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(168, 140, 255, 0.2)",
          borderRadius: "28px",
          padding: "36px 28px",
          boxShadow: "0 24px 60px rgba(5, 2, 16, 0.85), 0 0 30px rgba(139, 92, 246, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* 아바타 영역 */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          {/* 네온 그라데이션 링 */}
          <div
            style={{
              width: "112px",
              height: "112px",
              borderRadius: "9999px",
              padding: "3px",
              background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%)",
              boxShadow: "0 0 24px rgba(56, 189, 248, 0.35)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "9999px",
                overflow: "hidden",
                background: "linear-gradient(180deg, #38bdf8 0%, #1e1b4b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces"
                alt="김서연 프로필"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = "https://github.com/seoyeonkim-glitch.png";
                }}
              />
            </div>
          </div>
          {/* 상태 표시 그린 닷 */}
          <span
            style={{
              position: "absolute",
              bottom: "4px",
              right: "6px",
              width: "16px",
              height: "16px",
              backgroundColor: "#10b981",
              borderRadius: "9999px",
              border: "2.5px solid #191434",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.7)",
            }}
            title="온라인"
          />
        </div>

        {/* 이름 */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.5px",
            margin: "0 0 6px 0",
          }}
        >
          김서연
        </h1>

        {/* 소개글 */}
        <p
          style={{
            fontSize: "14px",
            color: "rgba(224, 215, 255, 0.75)",
            fontWeight: 400,
            lineHeight: "1.5",
            margin: "0 0 16px 0",
          }}
        >
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>

        {/* 뱃지 태그 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(42, 33, 85, 0.8)",
              color: "#c4b5fd",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>💻</span>
            <span>바이브 코딩</span>
          </span>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(42, 33, 85, 0.8)",
              color: "#c4b5fd",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🎓</span>
            <span>대학생</span>
          </span>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(42, 33, 85, 0.8)",
              color: "#c4b5fd",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🚀</span>
            <span>성장 중</span>
          </span>
        </div>

        {/* 하단 버튼 2개 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            width: "100%",
          }}
        >
          <Link
            href="mailto:seoyeonkim@hanyang.ac.kr"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "13px 16px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
              transition: "transform 0.15s ease, opacity 0.15s ease",
            }}
          >
            <svg
              style={{ width: "16px", height: "16px", fill: "currentColor" }}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>연락하기</span>
          </Link>

          <Link
            href="https://github.com/seoyeonkim-glitch"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "13px 16px",
              borderRadius: "14px",
              background: "rgba(45, 36, 88, 0.75)",
              color: "#f1f5f9",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              transition: "background 0.15s ease, transform 0.15s ease",
            }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span>링크</span>
          </Link>
        </div>
      </div>

      {/* 좌측 하단 Next.js 로고 워터마크 */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          width: "32px",
          height: "32px",
          borderRadius: "9999px",
          background: "rgba(22, 17, 46, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 180 180">
          <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
            <circle cx="90" cy="90" fill="black" r="90" />
          </mask>
          <g mask="url(#mask0)">
            <circle cx="90" cy="90" data-circle="true" fill="black" r="90" />
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
            <rect fill="white" height="72" width="12" x="115" y="54" />
          </g>
        </svg>
      </div>
    </div>
  );
}
