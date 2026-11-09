# 토스 디자인 시스템 (Toss Design System, TDS) 명세서

> 본 문서는 `my-link-hy` 프로젝트의 공식 디자인 가이드라인입니다.  
> **shadcn/ui**의 유연한 컴포넌트 아키텍처 위에 **토스 디자인 시스템(TDS)**의 미학과 UX 원칙을 결합하여 구현합니다.

---

## 1. 핵심 디자인 원칙 (Core Principles)

1. **단일 강조색 정책 (Single Blue Accent)**
   - 화면당 강조색은 **`blue-500` (`#3182F6`)** 단 하나만 사용합니다.
   - Primary CTA(핵심 행동 유도 버튼)는 **화면당 오직 1개**만 배치합니다.
2. **평면적이고 정갈한 표면 (Flat & Clean Surface)**
   - 불필요한 그라디언트와 무거운 드롭섀도우를 배제합니다.
   - 배경(`grey-100`), 카드 표면(`white`), 구분선(`grey-200`)의 명확한 면 분할을 통해 위계를 형성합니다.
3. **공격적이고 부드러운 곡률 (Radical Border Radius)**
   - 모바일 친화적이고 부드러운 감성을 위해 카드 `24px`, 버튼 `14px`, 태그 칩 `999px(Pill)`을 일관되게 적용합니다.
4. **해요체 카피라이팅 & 명확한 동사형 액션**
   - 사용자에게 신뢰감과 친근함을 주는 "해요체" 문장을 사용합니다. (예: `~개발자예요`, `친구와 동료에게 전달해요`)
   - 버튼은 "일어날 일을 직접 말한다"는 원칙에 따라 명확한 동사로 표현합니다. (예: `이메일로 연락하기`, `GitHub 방문하기`)

---

## 2. 디자인 토큰 명세 (Design Tokens)

### 2.1 색상 팔레트 (Color Palette)

| 토큰명 | HEX 코드 | 용도 및 가이드 |
|---|---|---|
| **`blue-500`** | `#3182F6` | **Primary CTA**, 링크 하이라이트, 액센트 (화면당 1개 제한) |
| **`blue-50`** | `#E8F3FF` | Brand Weak 배경, 활성 태그 칩 배경, 선택 영역 |
| **`grey-900`** | `#191F28` | Primary 텍스트 (이름, 카드 타이틀 등 최고 위계) |
| **`grey-700`** | `#4E5968` | Secondary 텍스트 (소개글, 서브 설명, 일반 칩 텍스트) |
| **`grey-500`** | `#8B95A1` | 핸들명(`@handle`), 섹션 레이블, 비활성 보조 안내 |
| **`grey-400`** | `#B0B8C1` | 비활성 텍스트, 약한 테두리 |
| **`grey-200`** | `#E5E8EB` | 표준 구분선(Divider), 카드 경계선 |
| **`grey-100`** | `#F2F4F6` | 페이지 배경, 보조 버튼 배경, 일반 칩 배경, 인터랙션 hover |
| **`white`** | `#FFFFFF` | 메인 프로필 카드 배경, 팝업 표면 |
| **`green-500`** | `#34C759` | 온라인 상태 인디케이터 |

### 2.2 타이포그래피 (Typography)
- **기본 폰트**: Pretendard Variable (TPS 대체 서체)
- **display / h1**: `22px ~ 28px` / Bold (700) / letter-spacing `-0.015em`
- **title**: `17px ~ 18px` / Semibold (600) / letter-spacing `-0.01em`
- **body**: `15px ~ 17px` / Regular (400) / line-height `1.5 ~ 1.6` / letter-spacing `-0.005em`
- **caption / tag**: `13px` / Semibold (600) / letter-spacing `0`

### 2.3 라운드 규격 (Border Radius)
- **카드 컨테이너**: `24px` (`rounded-[24px]`)
- **버튼 (L / Primary / Secondary)**: `14px` (`rounded-[14px]`)
- **인풋 / 컴팩트 버튼**: `12px` (`rounded-[12px]`)
- **칩 / 아바타 / 인디케이터**: `999px` (`rounded-full`)

---

## 3. shadcn/ui 컴포넌트 TDS 매핑 명세

| shadcn/ui 컴포넌트 | 파일 경로 | TDS 스타일 커스텀 규칙 |
|---|---|---|
| **`Button`** | `@/components/ui/button.tsx` | • **default**: `bg-[#3182F6] hover:bg-[#1B64DA] text-white rounded-[14px] h-[52px] font-bold text-[17px] active:scale-[0.98]`<br>• **secondary**: `bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#191F28] rounded-[14px] h-[52px] font-bold text-[17px] active:scale-[0.98]` |
| **`Card`** | `@/components/ui/card.tsx` | • **컨테이너**: `bg-white rounded-[24px] border-none shadow-none overflow-hidden`<br>• **리스트 로우(List-Row)**: `hover:bg-[#F2F4F6] rounded-[16px] transition-all p-3.5 flex items-center gap-[14px]` |
| **`Badge`** | `@/components/ui/badge.tsx` | • **default**: `bg-[#F2F4F6] text-[#4E5968] rounded-full h-[30px] px-3 font-semibold text-[13px]`<br>• **brand**: `bg-[#E8F3FF] text-[#3182F6] rounded-full h-[30px] px-3 font-semibold text-[13px]` |
| **`Avatar`** | `@/components/ui/avatar.tsx` | • `rounded-full bg-[#F2F4F6] h-20 w-20 overflow-hidden` 및 `fallbackSrc` 지원 |
| **`Separator`** | `@/components/ui/separator.tsx` | • `bg-[#E5E8EB] h-[1px] w-full my-0` |
| **`Toast`** | `@/components/ui/toast.tsx` | • 하단 플로팅 피드백 알림 (`rounded-full bg-[#191F28]/95 text-white`) |
