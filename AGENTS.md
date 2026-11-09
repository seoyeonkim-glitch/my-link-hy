<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 프로젝트 한국어(한글) 작성 및 개발 지침 (필수)

1. **모든 문서 및 대화 한글 작성**:
   - 사용자와의 모든 대화, 구현 계획서(`Implementation Plan`), 태스크(`Task`), 워크스루(`Walkthrough`), 프로젝트 문서(`PRD.md`, `design.md`), 코드 주석 및 커밋 메시지는 **반드시 한국어(한글)**로 작성합니다.
2. **스타일링 및 컴포넌트 표준**:
   - 모든 스타일은 CSS Module이나 인라인 스타일 없이 **Tailwind CSS**로 통일하며, `shadcn/ui` × 토스 디자인 시스템(TDS) 기반의 재사용 컴포넌트로 구성합니다.
3. **작업 완료 후 커밋 및 푸시**:
   - 작업 완료 후에는 항상 `git commit` 및 `git push origin main`까지 수행합니다.
