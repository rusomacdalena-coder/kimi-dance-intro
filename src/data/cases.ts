import { generatedCases } from './cases.generated'

export type {
  CaseMetric,
  CaseShotRow,
  CaseStudy,
} from './caseTypes'

export const cases = [...generatedCases].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
)

export function getCaseBySlug(slug: string) {
  return cases.find((item) => item.slug === slug)
}
