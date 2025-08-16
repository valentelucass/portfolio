import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN não configurado no servidor' },
      { status: 500 }
    );
  }
  const res = await fetch('https://api.github.com/users/valentelucass/starred?per_page=100', {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });
  const repos = await res.json();

  // Buscar o README de cada repo
  const reposWithReadme = await Promise.all(
    repos.map(async (repo: any) => {
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
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

  return NextResponse.json(reposWithReadme, { status: res.status });
} 