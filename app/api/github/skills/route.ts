// valentelucass/portfolio/portfolio-55ceec362ece7fba7b1ce304e781e5480562f2cf/app/api/github/skills/route.ts

import { NextResponse } from 'next/server';

// Interface para garantir a tipagem dos repositórios da API do GitHub
interface Repo {
  name: string;
  languages_url: string;
}

export async function GET() {
  try {
    const username = 'valentelucass';
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const reposRes = await fetch(reposUrl, { headers });

    if (!reposRes.ok) {
      throw new Error(`Erro ao buscar repositórios: ${reposRes.status}`);
    }

    const repos: Repo[] = await reposRes.json();

    // Objeto para armazenar a pontuação de cada linguagem
    const languageScores: Record<string, number> = {};

    // Processa a busca de linguagens para cada repositório em paralelo
    await Promise.all(
      repos.map(async (repo) => {
        try {
          const langRes = await fetch(repo.languages_url, { headers });
          if (!langRes.ok) return;

          const langs: Record<string, number> = await langRes.json();
          
          // Adicionamos a tipagem aqui para garantir que o reduce retorne um número
          const repoTotalBytes = Object.values(langs).reduce(
            (acc: number, bytes: number) => acc + bytes,
            0
          );

          if (repoTotalBytes === 0) return;

          for (const [lang, bytes] of Object.entries(langs)) {
            const percentageInRepo = (bytes / repoTotalBytes) * 100;
            languageScores[lang] = (languageScores[lang] || 0) + percentageInRepo;
          }
        } catch (error) {
          // Continua para o próximo repo se houver erro, logando o problema
          console.error(`Falha ao processar linguagens para o repositório ${repo.name}:`, error);
        }
      })
    );

    // Adicionamos a tipagem aqui também
    const totalScore = Object.values(languageScores).reduce(
      (acc: number, score: number) => acc + score,
      0
    );

    if (totalScore === 0) {
      // Retorna um array vazio se nenhuma linguagem for encontrada, em vez de um erro
      return NextResponse.json([], { status: 200 });
    }

    const skills = Object.entries(languageScores)
      .map(([name, score]) => ({
        name,
        percentage: Math.round((score / totalScore) * 100),
        color: getSkillColor(name),
      }))
      .filter(skill => skill.percentage > 0) // Garante que apenas skills com >0% sejam mostradas
      .sort((a, b) => b.percentage - a.percentage);

    return NextResponse.json(skills, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar skills:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar skills do GitHub' },
      { status: 500 }
    );
  }
}

function getSkillColor(skillName: string): string {
  const colors: Record<string, string> = {
    // Linguagens de programação
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
    'Dart': '#0175C2',
    'Scala': '#DC322F',
    'Perl': '#0298c3',
    'Shell': '#89e051',
    'Objective-C': '#438eff',

    // Frontend
    'React': '#61dafb',
    'Vue': '#4fc08d',
    'Angular': '#dd0031',
    'Next.js': '#000000',
    'Nuxt.js': '#00DC82',
    'Svelte': '#FF3E00',
    'Tailwind CSS': '#06b6d4',
    'CSS': '#1572b6',
    'HTML': '#e34f26',

    // Backend e frameworks
    'Node.js': '#339933',
    'Express': '#000000',
    'Django': '#092e20',
    'Flask': '#000000',
    'FastAPI': '#009688',
    'Spring': '#6DB33F',
    'Laravel': '#FF2D20',
    'Symfony': '#000000',
    'ASP.NET': '#512BD4',

    // Banco de Dados
    'MySQL': '#4479A1',
    'PostgreSQL': '#336791',
    'SQLite': '#003B57',
    'MongoDB': '#47A248',
    'Redis': '#DC382D',
    'MariaDB': '#003545',
    'Oracle': '#F80000',

    // DevOps / Ferramentas
    'Docker': '#2496ED',
    'Kubernetes': '#326CE5',
    'Git': '#F05032',
    'GitHub': '#181717',
    'GitLab': '#FC6D26',
    'Jenkins': '#D24939',
    'Terraform': '#844FBA',

    // Mobile
    'Flutter': '#02569B',
    'React Native': '#61dafb',
    'Android': '#3DDC84',
    'iOS': '#000000'
  };

  return colors[skillName] || '#6b7280';
}
