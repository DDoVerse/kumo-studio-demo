import { CASE_STUDIES, SERVICES, type CaseStudy, type Service } from "@/content/seed";

/**
 * 콘텐츠 접근 계층.
 *
 * Sanity 프로젝트가 연결되면 여기만 갈아끼운다. 지금은 로컬 시드를 읽는다 —
 * 자격 증명 없이도 리뷰어가 사이트를 그대로 열어볼 수 있어야 하기 때문이다.
 * 페이지 쪽은 이 함수들만 알면 되므로 전환 시 화면 코드는 건드리지 않는다.
 */
export const usingSanity = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return [...CASE_STUDIES].sort((a, b) => b.year - a.year);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  return CASE_STUDIES.find((c) => c.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  return SERVICES;
}

/** 케이스 스터디 하단의 "다음 프로젝트" — 목록을 순환한다. */
export async function getNextCaseStudy(slug: string): Promise<CaseStudy | null> {
  const all = await getCaseStudies();
  if (all.length < 2) return null;
  const i = all.findIndex((c) => c.slug === slug);
  return i === -1 ? null : all[(i + 1) % all.length];
}
