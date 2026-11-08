"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   아이콘 컴포넌트 (인라인 SVG)
───────────────────────────────────────── */
function IconGithub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   메인 페이지
───────────────────────────────────────── */
export default function Home() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("seoyeonkim@hanyang.ac.kr");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({ title: "김서연 | 프로필", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="tds-page">
      {/* ── 프로필 카드 ── */}
      <main className="tds-card" role="main">

        {/* 아바타 + 기본 정보 */}
        <section className="profile-section" aria-label="프로필 정보">
          <div className="avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github.com/seoyeonkim-glitch.png"
              alt="김서연 프로필 사진"
              className="avatar-img"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces";
              }}
            />
            <span className="online-dot" aria-label="온라인" />
          </div>

          <h1 className="profile-name">김서연</h1>
          <p className="profile-handle">@seoyeonkim-glitch</p>
          <p className="profile-bio">
            바이브 코딩으로 아이디어를 현실로 만드는 대학생 개발자예요.
            직관적이고 감각적인 웹 프로덕트를 만들어요.
          </p>

          {/* 태그 칩 */}
          <div className="chip-row" role="list" aria-label="관심사">
            <span className="chip" role="listitem">💻 바이브 코딩</span>
            <span className="chip" role="listitem">🎓 대학생</span>
            <span className="chip" role="listitem">🚀 성장 중</span>
            <span className="chip chip-brand" role="listitem">⚡ Next.js</span>
          </div>
        </section>

        {/* 구분선 */}
        <hr className="divider" />

        {/* 액션 버튼 */}
        <section className="action-section" aria-label="주요 액션">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="btn-primary"
          >
            {copied ? "이메일 복사됐어요 ✓" : "이메일로 연락하기"}
          </button>

          <Link
            href="https://github.com/seoyeonkim-glitch"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            GitHub 방문하기
          </Link>
        </section>

        {/* 구분선 */}
        <hr className="divider" />

        {/* 링크 목록 */}
        <section aria-label="링크 목록">
          <p className="section-label">링크</p>

          <ul className="link-list" role="list">
            {/* GitHub 저장소 */}
            <li role="listitem">
              <Link
                href="https://github.com/seoyeonkim-glitch/my-link-hy"
                target="_blank"
                rel="noopener noreferrer"
                className="list-row"
              >
                <span className="list-icon" style={{ background: "#F0F0FF", color: "#6366F1" }}>
                  <IconGithub />
                </span>
                <span className="list-text">
                  <span className="list-title">GitHub 저장소</span>
                  <span className="list-desc">my-link-hy 코드 보기</span>
                </span>
                <span className="list-chevron"><IconChevron /></span>
              </Link>
            </li>

            {/* 이메일 */}
            <li role="listitem">
              <Link
                href="mailto:seoyeonkim@hanyang.ac.kr"
                className="list-row"
              >
                <span className="list-icon" style={{ background: "#FFF3E0", color: "#F57C00" }}>
                  <IconMail />
                </span>
                <span className="list-text">
                  <span className="list-title">이메일 보내기</span>
                  <span className="list-desc">seoyeonkim@hanyang.ac.kr</span>
                </span>
                <span className="list-chevron"><IconChevron /></span>
              </Link>
            </li>

            {/* 공유하기 */}
            <li role="listitem">
              <button
                type="button"
                onClick={handleShare}
                className="list-row list-row-btn"
              >
                <span className="list-icon" style={{ background: "#E8F3FF", color: "#3182F6" }}>
                  <IconShare />
                </span>
                <span className="list-text">
                  <span className="list-title">
                    {shared ? "링크 복사됐어요 ✓" : "프로필 공유하기"}
                  </span>
                  <span className="list-desc">친구와 동료에게 전달해요</span>
                </span>
                <span className="list-chevron"><IconChevron /></span>
              </button>
            </li>
          </ul>
        </section>
      </main>

      {/* ── 푸터 ── */}
      <footer className="tds-footer">
        <p className="footer-text">© 2026 김서연</p>
        <p className="footer-sub">Made with Next.js</p>
      </footer>

      {/* ── 스타일 ── */}
      <style jsx global>{`
        /* ── 레이아웃 ── */
        .tds-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 48px;
          background: var(--grey-100);
        }

        /* ── 카드 ── */
        .tds-card {
          width: 100%;
          max-width: 390px;
          background: var(--white);
          border-radius: 24px;
          overflow: hidden;
        }

        /* ── 프로필 섹션 ── */
        .profile-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 24px 28px;
          gap: 0;
        }

        /* ── 아바타 ── */
        .avatar-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 16px;
        }
        .avatar-img {
          width: 80px;
          height: 80px;
          border-radius: 999px;
          object-fit: cover;
          display: block;
          background: var(--grey-100);
        }
        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #34C759;
          border-radius: 999px;
          border: 2.5px solid var(--white);
        }

        /* ── 텍스트 정보 ── */
        .profile-name {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.015em;
          color: var(--grey-900);
          margin-bottom: 4px;
        }
        .profile-handle {
          font-size: 13px;
          font-weight: 500;
          color: var(--grey-500);
          letter-spacing: 0;
          margin-bottom: 14px;
        }
        .profile-bio {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.6;
          letter-spacing: -0.005em;
          color: var(--grey-700);
          margin-bottom: 20px;
          word-break: keep-all;
        }

        /* ── 칩 ── */
        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 30px;
          padding: 0 12px;
          background: var(--grey-100);
          color: var(--grey-700);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          border-radius: 999px;
        }
        .chip-brand {
          background: var(--blue-50);
          color: var(--blue-500);
        }

        /* ── 구분선 ── */
        .divider {
          border: none;
          border-top: 1px solid var(--grey-200);
          margin: 0;
        }

        /* ── 액션 버튼 영역 ── */
        .action-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 24px;
        }

        /* primary CTA */
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 52px;
          background: var(--blue-500);
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.005em;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.12s ease, transform 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:active {
          opacity: 0.75;
          transform: scale(0.98);
        }

        /* secondary */
        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 52px;
          background: var(--grey-100);
          color: var(--grey-900);
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.005em;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.12s ease, transform 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-secondary:active {
          opacity: 0.75;
          transform: scale(0.98);
        }

        /* ── 섹션 레이블 ── */
        .section-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          color: var(--grey-500);
          padding: 20px 24px 10px;
        }

        /* ── 링크 목록 ── */
        .link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          padding: 0 0 8px;
        }

        .list-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 20px;
          text-decoration: none;
          color: var(--grey-900);
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          transition: background 0.1s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .list-row:active {
          background: var(--grey-100);
        }

        .list-row-btn {
          font-family: inherit;
        }

        .list-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .list-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .list-title {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.005em;
          color: var(--grey-900);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .list-desc {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0;
          color: var(--grey-500);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .list-chevron {
          color: var(--grey-400);
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        /* ── 푸터 ── */
        .tds-footer {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .footer-text {
          font-size: 13px;
          font-weight: 500;
          color: var(--grey-500);
          letter-spacing: 0;
        }
        .footer-sub {
          font-size: 12px;
          font-weight: 400;
          color: var(--grey-400);
          letter-spacing: 0;
        }

        /* ── 모바일 small 대응 ── */
        @media (max-width: 400px) {
          .tds-page {
            padding: 16px 12px 40px;
          }
          .profile-section {
            padding: 32px 20px 24px;
          }
          .action-section {
            padding: 16px 20px;
          }
          .btn-primary,
          .btn-secondary {
            height: 48px;
            font-size: 15px;
            border-radius: 12px;
          }
          .list-row {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}
