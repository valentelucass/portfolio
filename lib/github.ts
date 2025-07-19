"use client"

import { Repo, Skill, FeaturedProject } from '../types/github'

const CACHE_KEY = "github_skills_cache";
const CACHE_TIME = 60 * 60 * 1000; // 1 hora

export async function fetchGithubSkills(username: string): Promise<Skill[]> {
  // Verifica se localStorage está disponível (só no cliente)
  if (typeof window !== 'undefined') {
    // Tenta cache local
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TIME) {
          console.log("Usando cache das skills do GitHub");
          return data;
        }
      } catch (error) {
        // Se o cache estiver corrompido, remove
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }

  try {
    console.log("Buscando skills do GitHub para:", username);
    
    // Busca repositórios com autenticação
    const headers = getAuthHeaders();
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    console.log('[DEBUG] Fetching repos for skills from:', reposUrl);
    const reposRes = await fetch(reposUrl, { headers });
    console.log('[DEBUG] Status da resposta skills:', reposRes.status);
    const reposText = await reposRes.text();
    console.log('[DEBUG] Corpo da resposta skills:', reposText);
    if (!reposRes.ok) {
      throw new Error(`Erro ao buscar repositórios: ${reposRes.status} | Body: ${reposText}`);
    }
    const repos: Repo[] = JSON.parse(reposText);

    // Busca linguagens de cada repo
    const langStats: Record<string, number> = {};
    for (const repo of repos) {
      try {
        console.log('[DEBUG] Fetching languages for:', repo.name);
        const langRes = await fetch(repo.languages_url, { headers });
        console.log('[DEBUG] Status da resposta languages:', langRes.status);
        if (!langRes.ok) continue;
        const langs = await langRes.json();
        for (const [lang, bytes] of Object.entries(langs)) {
          langStats[lang] = (langStats[lang] || 0) + (bytes as number);
        }
      } catch (error) {
        console.log('[DEBUG] Erro ao buscar languages para:', repo.name, error);
        // Continua para o próximo repo se houver erro
        continue;
      }
    }

    // Calcula percentuais
    const total = Object.values(langStats).reduce((a, b) => a + b, 0);
    if (total === 0) {
      throw new Error("Nenhuma linguagem encontrada nos repositórios");
    }

    const skills: Skill[] = Object.entries(langStats)
      .map(([name, bytes]) => ({ 
        name, 
        percentage: Math.round((bytes / total) * 100),
        color: getSkillColor(name)
      }))
      .sort((a, b) => b.percentage - a.percentage);

    console.log("Skills encontradas:", skills);

    // Salva cache apenas se localStorage estiver disponível
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: skills, timestamp: Date.now() }));
        console.log("Cache das skills salvo");
      } catch (error) {
        // Ignora erro de localStorage
      }
    }

    return skills;
  } catch (error) {
    console.error("Erro ao buscar skills do GitHub:", error);
    throw error;
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
  };
  
  return colors[skillName] || '#6b7280';
}

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
console.log('[DEBUG] NEXT_PUBLIC_GITHUB_TOKEN:', GITHUB_TOKEN);

function getAuthHeaders(): Record<string, string> {
  if (GITHUB_TOKEN) {
    const headers = { Authorization: `token ${GITHUB_TOKEN}` };
    console.log('[DEBUG] Headers usados no fetch:', headers);
    return headers;
  }
  console.log('[DEBUG] Headers usados no fetch: {}');
  return {};
}

async function fetchUserRepos(username: string): Promise<Repo[]> {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  const headers = getAuthHeaders();
  console.log('[DEBUG] Fetching repos from:', url);
  const reposRes = await fetch(url, { headers });
  console.log('[DEBUG] Status da resposta:', reposRes.status);
  const text = await reposRes.text();
  console.log('[DEBUG] Corpo da resposta:', text);
  if (!reposRes.ok) {
    throw new Error(`Erro ao buscar repositórios: ${reposRes.status} | Body: ${text}`);
  }
  const repos: Repo[] = JSON.parse(text);
  for (const repo of repos) {
    try {
      const readmeUrl = `https://api.github.com/repos/${username}/${repo.name}/readme`;
      console.log('[DEBUG] Fetching README from:', readmeUrl);
      const readmeRes = await fetch(readmeUrl, { headers });
      console.log('[DEBUG] Status da resposta README:', readmeRes.status);
      if (readmeRes.status === 404) {
        repo.readme_content = '';
        repo.readme_error = 'README não encontrado (404).';
        console.log(`[DIAGNOSTIC] README.md não encontrado para ${repo.name}`);
        console.log(`[LOG][READMEBUSCA] 404 para ${repo.name} | URL: ${readmeUrl}`);
        continue;
      }
      const readmeText = await readmeRes.text();
      if (readmeRes.ok) {
        const readmeData = JSON.parse(readmeText);
        repo.readme_content = atob(readmeData.content);
        console.log(`[LOG][READMEBUSCA] README.md carregado para ${repo.name}`);
      } else {
        repo.readme_content = '';
        repo.readme_error = 'README não disponível ou não encontrado.';
        console.log(`[DIAGNOSTIC] Erro ao buscar README.md para ${repo.name}: status ${readmeRes.status}`);
        console.log(`[LOG][READMEBUSCA] Erro ao buscar README.md para ${repo.name} | Status: ${readmeRes.status} | URL: ${readmeUrl}`);
      }
    } catch (error) {
      console.log('[DEBUG] Erro ao buscar README:', error);
      repo.readme_content = '';
      repo.readme_error = 'README não disponível ou erro ao buscar.';
      console.log(`[LOG][READMEBUSCA] Exceção ao buscar README.md para ${repo.name} | Erro: ${error}`);
    }
  }
  return repos;
}

// Nova função para buscar apenas repositórios estrelados pelo usuário
async function fetchStarredRepos(username: string): Promise<Repo[]> {
  const url = `https://api.github.com/users/${username}/starred?per_page=100`;
  const headers = getAuthHeaders();
  console.log('[DEBUG] Fetching starred repos from:', url);
  const reposRes = await fetch(url, { headers });
  console.log('[DEBUG] Status da resposta (starred):', reposRes.status);
  const text = await reposRes.text();
  console.log('[DEBUG] Corpo da resposta (starred):', text);
  if (!reposRes.ok) {
    throw new Error(`Erro ao buscar repositórios estrelados: ${reposRes.status} | Body: ${text}`);
  }
  const repos: Repo[] = JSON.parse(text);
  for (const repo of repos) {
    try {
      const readmeUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`;
      console.log('[DEBUG] Fetching README from:', readmeUrl);
      const readmeRes = await fetch(readmeUrl, { headers });
      console.log('[DEBUG] Status da resposta README:', readmeRes.status);
      if (readmeRes.status === 404) {
        repo.readme_content = '';
        repo.readme_error = 'README não encontrado (404).';
        console.log(`[DIAGNOSTIC] README.md não encontrado para ${repo.name}`);
        console.log(`[LOG][READMEBUSCA] 404 para ${repo.name} | URL: ${readmeUrl}`);
        continue;
      }
      const readmeText = await readmeRes.text();
      if (readmeRes.ok) {
        const readmeData = JSON.parse(readmeText);
        repo.readme_content = decodeURIComponent(escape(atob(readmeData.content)));
      } else {
        repo.readme_content = '';
        repo.readme_error = 'README não disponível ou não encontrado.';
        console.log(`[DIAGNOSTIC] Erro ao buscar README.md para ${repo.name}: status ${readmeRes.status}`);
        console.log(`[LOG][READMEBUSCA] Erro ao buscar README.md para ${repo.name} | Status: ${readmeRes.status} | URL: ${readmeUrl}`);
      }
    } catch (error) {
      console.log('[DEBUG] Erro ao buscar README:', error);
      repo.readme_content = '';
      repo.readme_error = 'README não disponível ou erro ao buscar.';
      console.log(`[LOG][READMEBUSCA] Exceção ao buscar README.md para ${repo.name} | Erro: ${error}`);
    }
  }
  return repos;
}

// Alterar getFeaturedProjects para usar fetchStarredRepos
export async function getFeaturedProjects(username: string): Promise<FeaturedProject[]> {
  if (typeof window === 'undefined') {
    return getFallbackProjects()
  }

  const cacheKey = `featured-projects-${username}`
  const cached = localStorage.getItem(cacheKey)
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 3600000) { // 1 hour cache
      console.log('Using cached featured projects')
      return data
    }
  }

  try {
    console.log('Fetching featured projects for:', username)
    // Buscar apenas repositórios estrelados
    const repos = await fetchStarredRepos(username)
    console.log('Total starred repos found:', repos.length)
    
    const featuredProjects: FeaturedProject[] = []

    for (const repo of repos) {
      console.log(`[DEBUG][PORTFOLIO] Chamando parseFeaturedProject para: ${repo.name}`);
      if (!repo.readme_content) {
        console.log(`[DEBUG][PORTFOLIO] Repo sem readme_content: ${repo.name}`);
        continue;
      }
      console.log('[DEBUG][PORTFOLIO] Início do README:', repo.readme_content?.substring(0, 500));
      const meta = extractFeaturedMetadata(repo.readme_content);
      console.log('[DEBUG][PORTFOLIO] Metadados extraídos do README:', meta);
      if (!meta) continue;
      const project = {
        id: repo.id,
        name: meta.title || repo.name,
        description: meta.description || repo.description || '',
        technologies: meta.technologies ? meta.technologies.split(',').map(t => t.trim()) : [],
        demoUrl: meta.demo,
        githubUrl: repo.html_url,
        highlight: meta.highlight,
        imageUrl: meta.image ? `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/${meta.image}` : undefined,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        readmeContent: repo.readme_content,
      };
      featuredProjects.push(project);
    }

    // Sort by stars and recent updates
    featuredProjects.sort((a, b) => {
      if (a.stars !== b.stars) return b.stars - a.stars
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      data: featuredProjects,
      timestamp: Date.now()
    }))

    return featuredProjects
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return getFallbackProjects()
  }
}

function extractFeaturedMetadata(readme: string) {
  // Regex mais tolerante para capturar o bloco, aceitando qualquer coisa entre <!-- e PORTFOLIO-FEATURED
  const blockRegex = /<!--[^\S\r\n]*PORTFOLIO-FEATURED([\s\S]*?)-->/im;
  const match = readme.match(blockRegex);
  console.log('[DEBUG][PORTFOLIO] Bloco capturado:', match ? match[1] : 'NADA ENCONTRADO');
  if (!match) {
    console.log('[DEBUG][PORTFOLIO] Nenhum bloco PORTFOLIO-FEATURED encontrado.');
    return null;
  }
  const block = match[1];
  // Regex para capturar chave: valor (aceita espaços, acentos, português/inglês)
  const fieldRegex = /^\s*([\wÀ-ÿ\-]+)\s*:\s*(.+)$/gmi;
  let fields: Record<string, string> = {};
  let m;
  while ((m = fieldRegex.exec(block)) !== null) {
    let key = m[1].trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
    // Normaliza para inglês
    if (key === 'titulo') key = 'title';
    if (key === 'tecnologias') key = 'technologies';
    if (key === 'destaque' || key === 'highlight') key = 'highlight';
    if (key === 'imagem' || key === 'image') key = 'image';
    if (key === 'demo') key = 'demo';
    fields[key] = m[2].trim();
  }
  console.log('[DEBUG][PORTFOLIO] Campos extraídos:', fields);
  return fields;
}

function parseFeaturedProject(repo: Repo): FeaturedProject | null {
  console.log('[DEBUG][PORTFOLIO] Chamando parseFeaturedProject para:', repo.name);
  if (!repo.readme_content) {
    console.log('[DEBUG][PORTFOLIO] Repo sem readme_content:', repo.name);
    return null;
  }
  console.log('[DEBUG][PORTFOLIO] Início do README:', repo.readme_content?.substring(0, 500));
  const meta = extractFeaturedMetadata(repo.readme_content);
  console.log('[DEBUG][PORTFOLIO] Metadados extraídos do README:', meta);
  if (!meta) return null;
  return {
    id: repo.id,
    name: meta.title || repo.name,
    description: meta.description || repo.description || '',
    technologies: meta.technologies ? meta.technologies.split(',').map(t => t.trim()) : [],
    demoUrl: meta.demo,
    githubUrl: repo.html_url,
    highlight: meta.highlight,
    imageUrl: meta.image ? `https://raw.githubusercontent.com/${repo.name}/${repo.name}/main/${meta.image}` : undefined,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    readmeContent: repo.readme_content,
  };
}

function extractImageFromReadme(readme: string): string {
  // Look for markdown images: ![alt](url)
  const imageRegex = /!\[.*?\]\((.*?)\)/g
  let match = imageRegex.exec(readme);
  if (match) {
    return match[1];
  }

  // Look for HTML img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  match = imgRegex.exec(readme);
  if (match) {
    return match[1];
  }

  // Look for image URLs in the text
  const urlRegex = /https?:\/\/[^\s)]+\.(jpg|jpeg|png|gif|webp|svg)/gi
  match = urlRegex.exec(readme);
  if (match) {
    return match[0];
  }

  return ''
}

function extractDescriptionFromReadme(readme: string): string {
  const lines = readme.split('\n')
  
  // Look for the first paragraph after the title
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip headers, code blocks, and empty lines
    if (line.startsWith('#') || line.startsWith('```') || line === '') {
      continue
    }
    
    // Skip the PORTFOLIO-FEATURED section
    if (line.includes('PORTFOLIO-FEATURED') || line.startsWith('**')) {
      continue
    }
    
    // If we find a paragraph with content, use it
    if (line.length > 20 && line.length < 200) {
      return line
    }
  }
  
  return ''
}

function getFallbackProjects(): FeaturedProject[] {
  return [
    {
      id: 1,
      name: "Portfolio Website",
      description: "Site pessoal desenvolvido com Next.js e Tailwind CSS",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/valentelucass/portfolio",
      highlight: "Portfolio moderno com animações e design responsivo",
      stars: 5,
      forks: 2,
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "GitHub Skills Integration",
      description: "Sistema de integração automática com GitHub API",
      technologies: ["React", "GitHub API", "TypeScript"],
      githubUrl: "https://github.com/valentelucass/portfolio",
      highlight: "Integração dinâmica de skills e projetos do GitHub",
      stars: 3,
      forks: 1,
      updatedAt: new Date().toISOString()
    }
  ]
} 

// Limpar o cache dos projetos em destaque ao carregar a página
if (typeof window !== 'undefined') {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('featured-projects-')) localStorage.removeItem(k);
  });
} 