# Guia de Deploy na Vercel

Este documento contém instruções para fazer o deploy deste projeto na plataforma Vercel.

## Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Git instalado em sua máquina
- Repositório do projeto no GitHub, GitLab ou Bitbucket

## Configuração

### 1. Variáveis de Ambiente

Antes de fazer o deploy, certifique-se de configurar as seguintes variáveis de ambiente na Vercel:

- `GITHUB_TOKEN`: Token de acesso à API do GitHub (opcional, mas recomendado para evitar limitações de taxa)

Você pode gerar um token em: https://github.com/settings/tokens
Permissões necessárias: `public_repo`, `read:user`

### 2. Arquivos de Configuração

O projeto já contém os arquivos necessários para o deploy na Vercel:

- `next.config.mjs`: Configurações do Next.js
- `vercel.json`: Configurações específicas da Vercel

## Deploy

### Opção 1: Deploy Automático (recomendado)

1. Faça login na [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub, GitLab ou Bitbucket
4. Configure as variáveis de ambiente mencionadas acima
5. Clique em "Deploy"

### Opção 2: Deploy via CLI

1. Instale a CLI da Vercel:
   ```bash
   npm i -g vercel
   ```

2. Faça login na sua conta:
   ```bash
   vercel login
   ```

3. No diretório do projeto, execute:
   ```bash
   vercel
   ```

4. Siga as instruções para configurar o projeto

## Verificação

Após o deploy, verifique se:

1. O site está acessível pela URL fornecida pela Vercel
2. As imagens estão sendo carregadas corretamente
3. A integração com a API do GitHub está funcionando

## Solução de Problemas

### Erro nas Imagens

Se as imagens não estiverem carregando, verifique:

- Se a configuração `remotePatterns` em `next.config.mjs` está correta
- Se o domínio das imagens está permitido

### Erro na API do GitHub

Se a integração com o GitHub não estiver funcionando:

- Verifique se o `GITHUB_TOKEN` está configurado corretamente
- Verifique os logs de build na Vercel para identificar possíveis erros

## Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Next.js sobre Deploy](https://nextjs.org/docs/deployment)