"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
        {/* 프로필 이미지 / 아바타 */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md shadow-blue-100 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
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
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active" />
        </div>

        {/* 이름 및 핸들 */}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          김서연
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">@seoyeonkim-glitch</p>

        {/* 직무 뱃지 */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
          <span>🎓</span>
          <span>대학생 · Vibe Coding</span>
        </div>

        {/* 소개글 */}
        <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-sm">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>

        {/* 태그 / 관심 분야 */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            💻 바이브 코딩
          </span>
          <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            🎓 대학생
          </span>
          <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            🌱 성장 중
          </span>
        </div>

        {/* 구분선 */}
        <div className="w-full border-t border-gray-100 my-6" />

        {/* 링크 목록 */}
        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="https://github.com/seoyeonkim-glitch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-800 group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 fill-current text-gray-700" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </div>
            <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform text-xs">↗</span>
          </Link>

          <Link
            href="mailto:seoyeonkim@hanyang.ac.kr"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-800 group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact (Email)</span>
            </div>
            <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform text-xs">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
