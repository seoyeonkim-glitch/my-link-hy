import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { LinkIconType } from "@/types";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export interface OgFontDefinition {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: "normal";
}

export interface OgPublicLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon?: LinkIconType;
}

export interface OgPublicProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  links: OgPublicLink[];
  totalLinkCount: number;
}

interface FirestoreFieldValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
}

interface FirestoreRunQueryRow {
  document?: {
    name?: string;
    fields?: Record<string, FirestoreFieldValue>;
  };
}

let cachedFontsPromise: Promise<OgFontDefinition[]> | null = null;

/**
 * 배포 및 샌드박스(오프라인) 환경 모두에서 안정적으로 한글을 렌더링하기 위해
 * 프로젝트 내부의 Pretendard 서브셋 WOFF 폰트를 로드하고 캐싱합니다.
 */
export function loadOgFonts(): Promise<OgFontDefinition[]> {
  if (!cachedFontsPromise) {
    cachedFontsPromise = Promise.all([
      readFile(
        join(process.cwd(), "src/assets/fonts/Pretendard-Regular.subset.woff")
      ),
      readFile(
        join(process.cwd(), "src/assets/fonts/Pretendard-SemiBold.subset.woff")
      ),
      readFile(
        join(process.cwd(), "src/assets/fonts/Pretendard-Bold.subset.woff")
      ),
    ]).then(([regular, semiBold, bold]) => [
      {
        name: "Pretendard",
        data: regular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Pretendard",
        data: semiBold,
        weight: 600,
        style: "normal",
      },
      {
        name: "Pretendard",
        data: bold,
        weight: 700,
        style: "normal",
      },
    ]);
  }
  return cachedFontsPromise;
}

/**
 * Next.js metadataBase 및 링크 표기에 사용할 서비스 기준 URL을 반환합니다.
 */
export function getSiteUrl(): string {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  return rawUrl.replace(/\/+$/, "");
}

/**
 * 동적 route param(displayName)을 안전하게 디코딩합니다.
 */
export function decodeDisplayName(rawDisplayName: string): string {
  try {
    return decodeURIComponent(rawDisplayName).trim();
  } catch {
    return rawDisplayName.trim();
  }
}

/**
 * Satori 이미지 렌더링에서 깨질 수 있는 이모지/제어 문자를 제거하고 길이를 정리합니다.
 */
export function sanitizeOgText(value: string, maxLength?: number): string {
  const cleaned = value
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE00-\uFE0F\u200D]/gu,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  if (!maxLength || cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

/**
 * 링크 URL에서 도메인 중심의 간결한 표시 문자열을 추출합니다.
 */
export function formatDisplayUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("mailto:")) {
    return sanitizeOgText(trimmed.replace(/^mailto:/, ""), 34);
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return sanitizeOgText(`${host}${path}`, 36);
  } catch {
    return sanitizeOgText(trimmed.replace(/^https?:\/\//, ""), 36);
  }
}

function getStringField(
  fields: Record<string, FirestoreFieldValue> | undefined,
  key: string
): string {
  const field = fields?.[key];
  return typeof field?.stringValue === "string" ? field.stringValue : "";
}

/**
 * Firestore REST API를 통해 공개 프로필과 링크 목록을 안전하게 조회합니다.
 * 오프라인 환경이나 존재하지 않는 사용자, 타임아웃 발생 시 null을 반환합니다.
 */
export async function fetchPublicProfileForOg(
  rawDisplayName: string
): Promise<OgPublicProfile | null> {
  const displayName = decodeDisplayName(rawDisplayName);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!displayName || !projectId) {
    return null;
  }

  const keyParam = apiKey ? `?key=${encodeURIComponent(apiKey)}` : "";
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/(default)/documents`;

  try {
    const userRes = await fetch(`${baseUrl}:runQuery${keyParam}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "users" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "displayName" },
              op: "EQUAL",
              value: { stringValue: displayName },
            },
          },
          limit: 1,
        },
      }),
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });

    if (!userRes.ok) {
      return null;
    }

    const userRows = (await userRes.json()) as FirestoreRunQueryRow[];
    const userDoc = userRows.find((row) => row.document?.fields)?.document;

    if (!userDoc?.name || !userDoc.fields) {
      return null;
    }

    const uid = userDoc.name.split("/").pop() ?? "";
    if (!uid) {
      return null;
    }

    const resolvedDisplayName =
      getStringField(userDoc.fields, "displayName") || displayName;
    const email = getStringField(userDoc.fields, "email");
    const photoURL = getStringField(userDoc.fields, "photoURL");
    const bio = getStringField(userDoc.fields, "bio");

    let links: OgPublicLink[] = [];

    try {
      const linksRes = await fetch(
        `${baseUrl}/users/${encodeURIComponent(uid)}:runQuery${keyParam}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            structuredQuery: {
              from: [{ collectionId: "links" }],
              orderBy: [
                { field: { fieldPath: "createdAt" }, direction: "DESCENDING" },
              ],
              limit: 20,
            },
          }),
          signal: AbortSignal.timeout(3500),
          cache: "no-store",
        }
      );

      if (linksRes.ok) {
        const linkRows = (await linksRes.json()) as FirestoreRunQueryRow[];
        links = linkRows
          .filter((row) => row.document?.fields)
          .map((row) => {
            const doc = row.document!;
            const fields = doc.fields!;
            const rawIcon = getStringField(fields, "icon");
            const validIcon: LinkIconType | undefined =
              rawIcon === "chart" ||
              rawIcon === "file" ||
              rawIcon === "mail" ||
              rawIcon === "web" ||
              rawIcon === "github"
                ? rawIcon
                : undefined;

            return {
              id: doc.name?.split("/").pop() ?? "",
              title: getStringField(fields, "title"),
              url: getStringField(fields, "url"),
              description: getStringField(fields, "description"),
              icon: validIcon,
            };
          })
          .filter((item) => Boolean(item.title || item.url));
      }
    } catch {
      links = [];
    }

    return {
      uid,
      displayName: resolvedDisplayName,
      email,
      photoURL,
      bio,
      links,
      totalLinkCount: links.length,
    };
  } catch {
    return null;
  }
}

/**
 * 원격 프로필 이미지를 Satori에서 지원하는 포맷(PNG/JPEG/GIF)으로 선검증해
 * Data URI로 변환합니다. WebP·타임아웃 등 오류 시 null을 반환해 안전한 폴백을 보장합니다.
 */
export async function fetchAvatarDataUri(
  photoURL?: string | null
): Promise<string | null> {
  if (!photoURL || !/^https?:\/\//i.test(photoURL)) {
    return null;
  }

  try {
    const res = await fetch(photoURL, {
      headers: {
        Accept: "image/png, image/jpeg, image/gif",
      },
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const rawContentType = (res.headers.get("content-type") ?? "")
      .split(";")[0]
      .trim()
      .toLowerCase();

    const normalizedMime =
      rawContentType === "image/jpg" ? "image/jpeg" : rawContentType;

    if (
      normalizedMime !== "image/png" &&
      normalizedMime !== "image/jpeg" &&
      normalizedMime !== "image/gif"
    ) {
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0 || arrayBuffer.byteLength > 2 * 1024 * 1024) {
      return null;
    }

    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${normalizedMime};base64,${base64}`;
  } catch {
    return null;
  }
}
