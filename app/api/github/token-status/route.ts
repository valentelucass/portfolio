import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN não configurado no servidor', status: 'error' },
      { status: 500 }
    );
  }

  try {
    // Tenta fazer uma requisição simples para verificar o token
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const userData = await res.json();
      return NextResponse.json({
        status: 'valid',
        message: 'Token válido',
        username: userData.login,
        rate_limit: res.headers.get('x-ratelimit-remaining') || 'desconhecido'
      });
    } else {
      const errorData = await res.json();
      return NextResponse.json({
        status: 'invalid',
        message: `Token inválido ou expirado: ${res.status}`,
        error: errorData.message || 'Erro desconhecido',
        documentation_url: errorData.documentation_url
      }, { status: res.status });
    }
  } catch (error) {
    console.error('Erro ao verificar token do GitHub:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Erro ao verificar token do GitHub',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}