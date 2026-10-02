import { CASE_STUDIES, SERVICES, type CaseStudy, type Service } from "@/content/seed";

/**
 * Content access layer.
 *
 * Connecting Sanity means replacing this file and nothing else. For now it
 * reads the local seed, so the site opens with no credentials. Pages only
 * know these functions, so the switch touches no view code.
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

/** The "next project" link at the foot of a case study; wraps around. */
export async function getNextCaseStudy(slug: string): Promise<CaseStudy | null> {
  const all = await getCaseStudies();
  if (all.length < 2) return null;
  const i = all.findIndex((c) => c.slug === slug);
  return i === -1 ? null : all[(i + 1) % all.length];
}
