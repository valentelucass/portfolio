// types/github.ts

export interface Repo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  readme_content?: string
  languages_url: string
}

export interface Skill {
  name: string
  percentage: number
  color: string
}

export interface FeaturedProject {
  id: number
  name: string
  description: string
  technologies: string[]
  demoUrl?: string
  githubUrl: string
  highlight?: string
  imageUrl?: string
  stars: number
  forks: number
  updatedAt: string
  readmeContent?: string
} 