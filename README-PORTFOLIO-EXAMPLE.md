# Exemplo de README para Projetos em Destaque

## Como marcar seus projetos para aparecer no portfólio

Para que seus projetos apareçam automaticamente na seção "Projetos em Destaque" do portfólio, adicione o seguinte código no início do README do seu repositório:

```markdown
# Nome do Seu Projeto

<!-- PORTFOLIO-FEATURED -->
**Descrição:** Uma breve descrição do seu projeto em uma linha
**Tecnologias:** Next.js, TypeScript, Tailwind CSS
**Demo:** https://demo-do-seu-projeto.com
**Destaque:** O que torna este projeto especial (opcional)
**Imagem:** https://url-da-sua-imagem.com/screenshot.png (opcional)

## Sobre o Projeto

Aqui você pode escrever a descrição completa do projeto...
```

## Estrutura do Código

### Campos Obrigatórios:
- `**Descrição:**` - Descrição curta do projeto
- `**Tecnologias:**` - Lista de tecnologias separadas por vírgula

### Campos Opcionais:
- `**Demo:**` - URL da demonstração ao vivo
- `**Destaque:**` - Texto destacando o que torna o projeto especial
- `**Imagem:**` - URL da imagem do projeto (screenshot, logo, etc.)

## Detecção Automática de Imagens

O sistema também detecta automaticamente imagens no seu README:

### 1. Markdown Images:
```markdown
![Screenshot do projeto](https://exemplo.com/screenshot.png)
```

### 2. HTML Images:
```markdown
<img src="https://exemplo.com/screenshot.png" alt="Screenshot" />
```

### 3. URLs de Imagem no Texto:
```markdown
Veja o screenshot aqui: https://exemplo.com/screenshot.png
```

## Exemplo Completo

```markdown
# E-commerce Platform

<!-- PORTFOLIO-FEATURED -->
**Descrição:** Plataforma completa de e-commerce com pagamentos e gestão de estoque
**Tecnologias:** Next.js, TypeScript, Prisma, Stripe, PostgreSQL
**Demo:** https://meu-ecommerce.vercel.app
**Destaque:** Sistema completo com autenticação, pagamentos e dashboard administrativo
**Imagem:** https://exemplo.com/ecommerce-screenshot.png

![Screenshot da plataforma](https://exemplo.com/ecommerce-screenshot.png)

## 🚀 Sobre o Projeto

Este é um e-commerce full-stack desenvolvido com as melhores práticas...

## ✨ Funcionalidades

- Autenticação de usuários
- Sistema de pagamentos com Stripe
- Dashboard administrativo
- Gestão de produtos e estoque
- Histórico de pedidos

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Prisma, PostgreSQL
- **Pagamentos:** Stripe
- **Deploy:** Vercel

## 📦 Instalação

```bash
git clone https://github.com/seu-usuario/ecommerce-platform
cd ecommerce-platform
npm install
npm run dev
```

## 📝 Licença

Este projeto está sob a licença MIT.
```

## Dicas para Imagens

1. **Formato**: Use JPG, PNG, GIF, WebP ou SVG
2. **Tamanho**: Recomendado 600x400px ou similar
3. **Hosting**: Use serviços como:
   - GitHub Issues (arraste a imagem)
   - Imgur
   - Cloudinary
   - Vercel (para projetos deployados)
4. **Qualidade**: Imagens nítidas e bem iluminadas
5. **Conteúdo**: Screenshots da aplicação funcionando

## Dicas Importantes

1. **Posicionamento**: O código deve estar no início do README, logo após o título
2. **Formatação**: Use exatamente a formatação mostrada acima
3. **Tecnologias**: Liste as principais tecnologias usadas
4. **Descrição**: Seja conciso mas informativo
5. **Demo**: Sempre que possível, forneça um link para demonstração
6. **Imagem**: Inclua um screenshot ou logo do projeto

## Como Funciona

O sistema do portfólio:
1. Busca todos os seus repositórios no GitHub
2. Filtra apenas os que contêm `<!-- PORTFOLIO-FEATURED -->`
3. Extrai as informações do README
4. **Detecta imagens automaticamente** ou usa a URL fornecida
5. Exibe automaticamente na seção de projetos
6. Atualiza a cada hora (cache)

## Benefícios

- ✅ Atualização automática do portfólio
- ✅ Controle total sobre quais projetos destacar
- ✅ **Detecção automática de imagens**
- ✅ Informações sempre atualizadas
- ✅ Design responsivo e moderno
- ✅ Integração perfeita com GitHub
- ✅ Fallback para placeholder se imagem falhar 