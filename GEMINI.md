# 프로젝트 에이전트 지침 (GEMINI.md)

## 1. 언어 및 문서 작성 규칙 (필수)
- **한국어(한글) 사용 원칙**: 모든 대화 응답, 코드 주석, 커밋 메시지뿐만 아니라 에이전트가 생성하는 모든 아티팩트 문서(**구현 계획서 `Implementation Plan`**, **태스크 `Task`**, **워크스루 `Walkthrough`**)와 프로젝트 문서(`PRD.md`, `design.md` 등)는 **반드시 한글로 작성**합니다.

## 2. 기술 스택 및 디자인 시스템 규칙
- **프레임워크**: Next.js (App Router), React, TypeScript
- **스타일링**: CSS Module(`.module.css`), `<style jsx>`, 인라인 `style` 속성을 사용하지 않고 **Tailwind CSS(v4)** 유틸리티 클래스로 100% 통일합니다.
- **UI 컴포넌트**: `shadcn/ui` 프리미티브 컴포넌트(`src/components/ui/`)와 토스 디자인 시스템(TDS, `design.md`)을 기반으로 재사용 가능하게 설계합니다.

## 3. Git 워크플로우 규칙
- 기능 구현, 리팩토링, 문서 업데이트 작업이 완료되면 항상 변경 사항을 스테이징(`git add`), 의미 있는 한글 커밋 메시지로 커밋(`git commit`), 원격 저장소 푸시(`git push origin main`)까지 진행합니다.
