"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("seoyeonkim@hanyang.ac.kr");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0718",
        backgroundImage: "radial-gradient(circle at 50% 35%, #241852 0%, #100b26 55%, #070512 100%)",
        color: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Pretendard Variable", Pretendard, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 엠비언트 오로라 배경 구형 빛 1 (보라색) */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          top: "-120px",
          left: "-120px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* 엠비언트 오로라 배경 구형 빛 2 (사이언/블루) */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          bottom: "-100px",
          right: "-100px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* 메인 프로필 카드 */}
      <div
        style={{
          width: "100%",
          maxWidth: "390px",
          background: "linear-gradient(165deg, rgba(28, 22, 60, 0.82) 0%, rgba(16, 12, 38, 0.9) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(192, 168, 255, 0.18)",
          borderRadius: "32px",
          padding: "40px 30px 32px",
          boxShadow:
            "0 30px 70px -10px rgba(0, 0, 0, 0.85), 0 0 45px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* 아바타 영역 */}
        <div style={{ position: "relative", marginBottom: "18px" }}>
          {/* 네온 아우라 그라데이션 링 */}
          <div
            style={{
              width: "116px",
              height: "116px",
              borderRadius: "9999px",
              padding: "3.5px",
              background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #c084fc 100%)",
              boxShadow: "0 0 28px rgba(56, 189, 248, 0.4), 0 0 12px rgba(192, 132, 252, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces"
                alt="김서연 프로필"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = "https://github.com/seoyeonkim-glitch.png";
                }}
              />
            </div>
          </div>

          {/* 온라인 상태 펄스 인디케이터 */}
          <div
            style={{
              position: "absolute",
              bottom: "4px",
              right: "6px",
              width: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: "#10b981",
                opacity: 0.6,
                animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
            <span
              style={{
                position: "relative",
                width: "14px",
                height: "14px",
                backgroundColor: "#10b981",
                borderRadius: "9999px",
                border: "2.5px solid #161033",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
              }}
              title="온라인 상태"
            />
          </div>
        </div>

        {/* 이름 */}
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "-0.6px",
            margin: "0 0 4px 0",
            background: "linear-gradient(180deg, #ffffff 40%, #e2e8f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          김서연
        </h1>

        {/* 서브타이틀 뱃지 */}
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#a78bfa",
            letterSpacing: "0.2px",
            marginBottom: "12px",
            display: "inline-block",
          }}
        >
          ✨ Frontend & Vibe Coder
        </span>

        {/* 소개글 */}
        <p
          style={{
            fontSize: "14px",
            color: "rgba(226, 219, 255, 0.78)",
            fontWeight: 400,
            lineHeight: "1.55",
            margin: "0 0 18px 0",
            maxWidth: "300px",
          }}
        >
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다. 사용자 중심의 감각적인 웹을 만듭니다.
        </p>

        {/* 태그 / 뱃지 리스트 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "26px",
          }}
        >
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(45, 35, 92, 0.75)",
              color: "#c4b5fd",
              border: "1px solid rgba(168, 85, 247, 0.28)",
              backdropFilter: "blur(8px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <span>💻</span>
            <span>바이브 코딩</span>
          </span>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(45, 35, 92, 0.75)",
              color: "#c4b5fd",
              border: "1px solid rgba(168, 85, 247, 0.28)",
              backdropFilter: "blur(8px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <span>🎓</span>
            <span>대학생</span>
          </span>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              background: "rgba(45, 35, 92, 0.75)",
              color: "#c4b5fd",
              border: "1px solid rgba(168, 85, 247, 0.28)",
              backdropFilter: "blur(8px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <span>🚀</span>
            <span>성장 중</span>
          </span>
        </div>

        {/* 메인 버튼 2개 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            width: "100%",
            marginBottom: "16px",
          }}
        >
          {/* 연락하기 (이메일 복사 또는 전송) */}
          <button
            onClick={handleCopyEmail}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "13px 16px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
              transition: "all 0.2s ease",
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
            <span>{copied ? "복사완료! ✓" : "연락하기"}</span>
          </button>

          {/* 깃허브 링크 버튼 */}
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
              borderRadius: "16px",
              background: "rgba(48, 38, 94, 0.75)",
              color: "#f8fafc",
              border: "1px solid rgba(192, 168, 255, 0.28)",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
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

        {/* 소셜 빠른 링크 아이콘 바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginTop: "10px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            width: "100%",
          }}
        >
          {/* GitHub */}
          <Link
            href="https://github.com/seoyeonkim-glitch/my-link-hy"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cbd5e1",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
            }}
          >
            <svg style={{ width: "18px", height: "18px", fill: "currentColor" }} viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </Link>

          {/* Email */}
          <Link
            href="mailto:seoyeonkim@hanyang.ac.kr"
            title="Email"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cbd5e1",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
            }}
          >
            <svg style={{ width: "18px", height: "18px", fill: "none", stroke: "currentColor", strokeWidth: "2" }} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </Link>

          {/* Share / Copy Link */}
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "김서연 | 프로필", url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("프로필 링크가 클립보드에 복사되었습니다! ✨");
              }
            }}
            title="링크 공유하기"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cbd5e1",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg style={{ width: "16px", height: "16px", fill: "none", stroke: "currentColor", strokeWidth: "2" }} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 좌측 하단 Next.js 워터마크 아이콘 */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          width: "36px",
          height: "36px",
          borderRadius: "9999px",
          background: "rgba(24, 18, 48, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          backdropFilter: "blur(14px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
          cursor: "pointer",
        }}
        title="Powered by Next.js 16"
      >
        <svg style={{ width: "18px", height: "18px", fill: "currentColor" }} viewBox="0 0 180 180">
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

      <style jsx global>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
