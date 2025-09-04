import { NextResponse } from 'next/server';

export async function GET() {
  // --- ADICIONE SUA LISTA DE LINGUAGENS A IGNORAR AQUI ---
  const ignoreList = [
    'PowerShell',
    'Roff',
    'Batchfile',
    'Shell',
//  'Hack', // Exemplo de como adicionar mais
//  'Makefile',
//  'Dockerfile' 
  ];
  // -----------------------------------------------------------

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN não configurado no servidor' },
      { status: 500 }
    );
  }

  try {
    const username = 'valentelucass';
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    const reposRes = await fetch(reposUrl, { headers });
    if (!reposRes.ok) {
      throw new Error(`Erro ao buscar repositórios: ${reposRes.status}`);
    }
    const repos = await reposRes.json();
    const langStats: Record<string, number> = {};
    for (const repo of repos) {
      try {
        if (!repo.languages_url) continue;
        const langRes = await fetch(repo.languages_url, { headers });
        if (!langRes.ok) continue;
        const langs = await langRes.json();
        for (const [lang, bytes] of Object.entries(langs)) {
          langStats[lang] = (langStats[lang] || 0) + (bytes as number);
        }
      } catch (error) {
        console.error(`Erro ao buscar linguagens para o repo ${repo.name}:`, error);
        continue;
      }
    }

    const total = Object.values(langStats).reduce((a, b) => a + b, 0);
    if (total === 0) {
      throw new Error('Nenhuma linguagem encontrada nos repositórios');
    }

    const skills = Object.entries(langStats)
      .map(([name, bytes]) => {
        const percentage = parseFloat(((bytes / total) * 100).toFixed(2));
        return {
          name,
          bytes,
          percentage,
          color: getSkillColor(name),
        };
      })
      // 1. Filtra linguagens com porcentagem zero
      .filter((skill) => skill.percentage > 0)
      // 2. *** NOVO FILTRO PARA IGNORAR LINGUAGENS INDESEJADAS ***
      .filter((skill) => !ignoreList.includes(skill.name))
      // 3. Ordena pelo número exato de bytes
      .sort((a, b) => b.bytes - a.bytes)
      // 4. Remove a propriedade 'bytes' do objeto final
      .map(({ bytes, ...rest }) => rest);

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

// A função getSkillColor continua a mesma...
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