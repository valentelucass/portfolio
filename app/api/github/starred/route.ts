import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN não configurado no servidor' },
      { status: 500 }
    );
  }
  
  try {
    // Formato correto de autorização para tokens pessoais do GitHub
    const res = await fetch('https://api.github.com/users/valentelucass/starred?per_page=100&sort=updated&direction=desc', {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      // Se a resposta não for bem-sucedida, retorna o erro
      const errorData = await res.json();
      console.error('Erro na API do GitHub:', {
        status: res.status,
        statusText: res.statusText,
        message: errorData.message,
        documentation_url: errorData.documentation_url
      });
      
      return NextResponse.json(
        { 
          error: `Erro ao buscar repositórios estrelados: ${res.status} - ${errorData.message || res.statusText}`,
          documentation_url: errorData.documentation_url
        },
        { status: res.status }
      );
    }
  const repos = await res.json();

  // Buscar o README de cada repo
  const reposWithReadme = await Promise.all(
    repos.map(async (repo: any) => {
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          repo.readme_content = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        } else {
          repo.readme_content = '';
        }
      } catch {
        repo.readme_content = '';
      }
      return repo;
    })
  );

  // Ordenação determinística: updated_at desc, stargazers_count desc, id desc
  reposWithReadme.sort((a: any, b: any) => {
    const byUpdated = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    if (byUpdated !== 0) return byUpdated;
    const byStars = (b.stargazers_count || 0) - (a.stargazers_count || 0);
    if (byStars !== 0) return byStars;
    return (b.id || 0) - (a.id || 0);
  });

  return NextResponse.json(reposWithReadme, { 
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
  } catch (error) {
    console.error('Erro ao buscar repositórios estrelados:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar repositórios estrelados' },
      { status: 500 }
    );
  }
}