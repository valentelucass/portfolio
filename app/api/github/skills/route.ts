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
    'JavaScript': '#f7df1e', 'TypeScript': '#3178c6', 'Python': '#3776ab', 'Java': '#ed8b00', 'C++': '#00599c', 'C#': '#239120', 'PHP': '#777bb4', 'Ruby': '#cc342d', 'Go': '#00add8', 'Rust': '#ce422b', 'Swift': '#ffac45', 'Kotlin': '#7f52ff', 'Dart': '#0175C2', 'Scala': '#DC322F', 'Perl': '#0298c3', 'Shell': '#89e051', 'Objective-C': '#438eff',
    'React': '#61dafb', 'Vue': '#4fc08d', 'Angular': '#dd0031', 'Next.js': '#000000', 'Nuxt.js': '#00DC82', 'Svelte': '#FF3E00', 'Tailwind CSS': '#06b6d4', 'CSS': '#1572b6', 'HTML': '#e34f26',
    'Node.js': '#339933', 'Express': '#000000', 'Django': '#092e20', 'Flask': '#000000', 'FastAPI': '#009688', 'Spring': '#6DB33F', 'Laravel': '#FF2D20', 'Symfony': '#000000', 'ASP.NET': '#512BD4',
    'MySQL': '#4479A1', 'PostgreSQL': '#336791', 'SQLite': '#003B57', 'MongoDB': '#47A248', 'Redis': '#DC382D', 'MariaDB': '#003545', 'Oracle': '#F80000',
    'Docker': '#2496ED', 'Kubernetes': '#326CE5', 'Git': '#F05032', 'GitHub': '#181717', 'GitLab': '#FC6D26', 'Jenkins': '#D24939', 'Terraform': '#844FBA',
    'Flutter': '#02569B', 'React Native': '#61dafb', 'Android': '#3DDC84', 'iOS': '#000000'
  };
  
  return colors[skillName] || '#6b7280'
}
