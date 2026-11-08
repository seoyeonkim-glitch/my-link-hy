"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#201744_0%,_#110c26_60%,_#090615_100%)]">
      {/* 프로필 카드 */}
      <div className="w-full max-w-[390px] bg-[#181236]/80 backdrop-blur-xl border border-purple-400/15 rounded-[28px] p-8 shadow-[0_20px_50px_rgba(10,5,30,0.8)] flex flex-col items-center text-center">
        {/* 아바타 영역 */}
        <div className="relative mx-auto mb-4">
          <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-500 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#150f2e] flex items-center justify-center text-white text-3xl font-bold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github.com/seoyeonkim-glitch.png"
                alt="김서연 프로필"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
          {/* 상태 표시 그린 닷 */}
          <span
            className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#181236] shadow-sm"
            title="온라인"
          />
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          김서연
        </h1>

        {/* 소개글 */}
        <p className="mt-2 text-sm text-purple-200/70 font-normal leading-relaxed">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>

        {/* 뱃지 태그 */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#271e50]/90 text-[#b5a3ff] border border-purple-500/20 shadow-xs flex items-center gap-1.5">
            <span>💻</span>
            <span>바이브 코딩</span>
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#271e50]/90 text-[#b5a3ff] border border-purple-500/20 shadow-xs flex items-center gap-1.5">
            <span>🎓</span>
            <span>대학생</span>
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#271e50]/90 text-[#b5a3ff] border border-purple-500/20 shadow-xs flex items-center gap-1.5">
            <span>🚀</span>
            <span>성장 중</span>
          </span>
        </div>

        {/* 하단 버튼 2개 */}
        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
          <Link
            href="mailto:seoyeonkim@hanyang.ac.kr"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-[0_4px_16px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4 fill-current"
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
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#292055]/80 hover:bg-[#33286b] text-gray-200 hover:text-white border border-purple-400/20 font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4"
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

      {/* 좌측 하단 Next.js 워터마크 아이콘 */}
      <div className="fixed bottom-6 left-6 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md shadow-sm">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 180 180">
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
