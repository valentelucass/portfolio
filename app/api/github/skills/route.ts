import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const username = 'valentelucass'
    
    // Busca repositórios com autenticação
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    }
    
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`
    const reposRes = await fetch(reposUrl, { headers })
    
    if (!reposRes.ok) {
      throw new Error(`Erro ao buscar repositórios: ${reposRes.status}`)
    }
    
    const repos = await reposRes.json()

    // Busca linguagens de cada repo
    const langStats: Record<string, number> = {}
    for (const repo of repos) {
      try {
        const langRes = await fetch(repo.languages_url, { headers })
        if (!langRes.ok) continue
        const langs = await langRes.json()
        for (const [lang, bytes] of Object.entries(langs)) {
          langStats[lang] = (langStats[lang] || 0) + (bytes as number)
        }
      } catch (error) {
        // Continua para o próximo repo se houver erro
        continue
      }
    }

    // Calcula percentuais
    const total = Object.values(langStats).reduce((a, b) => a + b, 0)
    if (total === 0) {
      throw new Error("Nenhuma linguagem encontrada nos repositórios")
    }

    const skills = Object.entries(langStats)
      .map(([name, bytes]) => ({ 
        name, 
        percentage: Math.round((bytes / total) * 100),
        color: getSkillColor(name)
      }))
      .sort((a, b) => b.percentage - a.percentage)

    return NextResponse.json(skills, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Erro ao buscar skills:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar skills do GitHub' },
      { status: 500 }
    )
  }
}

function getSkillColor(skillName: string): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'Java': '#ed8b00',
    'C++': '#00599c',
    'C#': '#239120',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'Go': '#00add8',
    'Rust': '#ce422b',
    'Swift': '#ffac45',
    'Kotlin': '#7f52ff',
    'React': '#61dafb',
    'Vue': '#4fc08d',
    'Angular': '#dd0031',
    'Node.js': '#339933',
    'Next.js': '#000000',
    'Tailwind CSS': '#06b6d4',
    'CSS': '#1572b6',
    'HTML': '#e34f26'
  }
  
  return colors[skillName] || '#6b7280'
} 