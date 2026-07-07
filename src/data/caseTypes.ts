export interface CaseMetric {
  label: string
  value: string
  note?: string
}

export interface CaseShotRow {
  shot: string
  time: string
  scene: string
  visual: string
  emotion: string
  narrative: string
}

export interface CaseStudy {
  slug: string
  title: string
  sourceTitle: string
  summary: string
  publishedAt: string
  updatedAt: string
  durationLabel?: string
  sourceFiles: string[]
  metrics: CaseMetric[]
  structure: string[]
  methodology: string[]
  shotRows: CaseShotRow[]
  markdownPath: string
}
