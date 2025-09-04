# 🚀 Portfolio Lucas Andrade

Portfolio profissional desenvolvido com Next.js 15, TypeScript, Tailwind CSS e componentes modernos.

## ✨ Características

- 🎨 **Design Moderno**: Interface glassmórfica com gradientes e animações
- 📱 **Responsivo**: Otimizado para todos os dispositivos
- ⚡ **Performance**: Lazy loading, cache inteligente e otimizações
- 🔒 **Seguro**: Headers de segurança e validação de dados
- 🛠️ **Manutenível**: Código organizado e bem documentado
- 🎯 **SEO**: Otimizado para motores de busca

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas
- **Radix UI** - Componentes acessíveis

### Backend & APIs
- **GitHub API** - Dados de repositórios e skills
- **Node.js** - Runtime JavaScript

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/valentelucass/portfolio.git
cd portfolio
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local
cp .env.example .env.local

# Adicione seu token do GitHub (opcional)
GITHUB_TOKEN=seu_token_aqui
```

4. **Execute em desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse o projeto**
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
portfolio/
├── app/                    # App Router (Next.js 15)
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Radix UI)
│   ├── shared/           # Componentes compartilhados
│   └── sections/         # Seções da página
├── lib/                  # Utilitários e configurações
│   ├── cache.ts          # Sistema de cache
│   ├── logger.ts         # Sistema de logging
│   └── github.ts         # Integração GitHub API
├── types/                # Definições TypeScript
├── styles/               # Arquivos CSS organizados
├── public/               # Arquivos estáticos
└── diagnostics/          # Documentação e diagnósticos
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Compila o projeto para produção
npm run start            # Inicia o servidor de produção

# Qualidade de código
npm run lint             # Verifica problemas de linting
npm run lint:fix         # Corrige problemas de linting automaticamente
npm run type-check       # Verifica tipos TypeScript

# Manutenção
npm run maintenance      # Interface para todos os scripts de manutenção
npm run health           # Verifica a saúde do projeto
npm run cleanup          # Remove arquivos temporários e caches
npm run clean-backups    # Remove backups antigos
npm run check-deps       # Verifica dependências não utilizadas
npm run check-dupes      # Verifica arquivos duplicados
npm run organize         # Organiza arquivos na raiz do projeto

# Dependências
npm run update-deps      # Atualiza dependências
npm run audit            # Verifica vulnerabilidades
npm run audit:fix        # Corrige vulnerabilidades automaticamente
```

## 🧹 Manutenção do Projeto

## 🔍 Verificação de Saúde do Projeto

```bash
# ⭐️ RECOMENDADO: Execute este comando regularmente para manter seu projeto saudável! ⭐️
npm run health
```

> **Dica**: Execute este comando pelo menos uma vez por semana para garantir que seu projeto permaneça limpo e otimizado!

O script `npm run health` gera um relatório completo e detalhado sobre a saúde do seu projeto, analisando:

- 🗑️ **Arquivos desnecessários**: Identifica arquivos temporários, caches e outros arquivos que podem ser removidos com segurança
- 🔄 **Arquivos duplicados**: Detecta arquivos com conteúdo idêntico que ocupam espaço desnecessário
- 📦 **Dependências não utilizadas**: Encontra pacotes instalados que não estão sendo usados no código
- ⚠️ **Inconsistências de configuração**: Identifica problemas como múltiplos arquivos de configuração para a mesma ferramenta
- 💡 **Sugestões de melhoria**: Fornece recomendações personalizadas para otimizar seu projeto

### Outros Scripts de Manutenção

Além do script principal de saúde, o projeto inclui vários outros scripts para manter o código limpo e organizado:

- **Limpeza**:
  - `npm run cleanup` - Remove arquivos temporários e caches
  - `npm run clean-backups` - Remove backups antigos

- **Verificação**:
  - `npm run check-deps` - Verifica dependências não utilizadas
  - `npm run check-dupes` - Verifica arquivos duplicados

- **Organização**:
  - `npm run organize` - Estrutura os arquivos de configuração e documentação em pastas apropriadas

Para executar todos os scripts de manutenção de uma vez:

```bash
npm run maintenance
```

Para mais detalhes sobre cada script, consulte a documentação na pasta `scripts/`.

# Qualidade de Código
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige problemas de linting
npm run type-check       # Verifica tipos TypeScript

# Manutenção
npm run clean            # Limpa arquivos de build
npm run update-deps      # Atualiza dependências
npm run audit            # Verifica vulnerabilidades
npm run audit:fix        # Corrige vulnerabilidades
```

## 🎨 Sistema de Design

### Cores
- **Primária**: Gradiente cyan-500 → blue-500
- **Secundária**: Gradiente blue-500 → cyan-500
- **Background**: slate-900 → slate-800 → slate-900
- **Texto**: white, zinc-400, zinc-500

### Componentes
- **Cards Glassmórficos**: Efeito de vidro com backdrop-blur
- **Botões Gradientes**: Animações suaves e hover effects
- **Navegação Flutuante**: Menu responsivo com animações
- **Timeline**: Linha do tempo interativa

### Animações
- **Blob Animation**: Formas orgânicas em movimento
- **Hover Effects**: Transições suaves nos elementos
- **Scroll Animations**: Animações baseadas no scroll
- **Loading States**: Estados de carregamento elegantes

## 🔒 Segurança

### Headers de Segurança
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `Referrer-Policy: origin-when-cross-origin` - Controle de referrer
- `X-XSS-Protection: 1; mode=block` - Proteção XSS

### Validação de Dados
- Validação de entrada com Zod
- Sanitização de dados da API
- Tratamento seguro de tokens

## ⚡ Performance

### Otimizações Implementadas
- **Lazy Loading**: Componentes carregados sob demanda
- **Cache Inteligente**: Sistema de cache com TTL
- **Image Optimization**: Otimização automática de imagens
- **Bundle Splitting**: Divisão inteligente do bundle
- **Code Splitting**: Carregamento dinâmico de código

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🐛 Debug e Logging

### Sistema de Logging
```typescript
import { logger } from '@/lib/logger';

// Diferentes níveis de log
logger.debug('Informação de debug');
logger.info('Informação geral');
logger.warn('Aviso');
logger.error('Erro', error);

// Logs específicos
logger.performance('Operação', duration);
logger.api('GET', '/api/data', 200);
```

### Error Boundary
```typescript
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

<ErrorBoundary fallback={<CustomError />}>
  <Component />
</ErrorBoundary>
```

## 📊 Cache e Estado

### Sistema de Cache
```typescript
import { cacheManager, githubCache } from '@/lib/cache';

// Cache global
cacheManager.set('key', data, ttl);

// Cache específico
githubCache.set('user-repos', repos, 1800000); // 30 min
```

### Tipos de Cache
- **GitHub Cache**: 30 minutos TTL
- **Projects Cache**: 1 hora TTL
- **Skills Cache**: 2 horas TTL

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
└── e2e/           # Testes end-to-end
```

### Executar Testes
```bash
npm test           # Testes unitários
npm run test:e2e   # Testes E2E
npm run test:coverage # Cobertura de testes
```

## 📈 Monitoramento

### Analytics
- Google Analytics 4
- Eventos customizados
- Métricas de performance

### Error Tracking
- Captura de erros automática
- Relatórios detalhados
- Notificações em tempo real

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Compatível com Next.js
- **Railway**: Deploy simples
- **AWS Amplify**: Para projetos empresariais

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email**: lucasmac.dev@gmail.com
- **LinkedIn**: [Lucas Andrade](https://www.linkedin.com/in/dev-lucasandrade/)
- **GitHub**: [@valentelucass](https://github.com/valentelucass)
- **WhatsApp**: +55 84 99418-7843

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [Tailwind CSS](https://tailwindcss.com/) - CSS utilitário
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Framer Motion](https://www.framer.com/motion/) - Animações fluidas

---

**Desenvolvido com ❤️ por Lucas Andrade**
