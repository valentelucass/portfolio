# Scripts de Manutenção do Projeto

Esta pasta contém scripts utilitários para manutenção e organização do projeto. Estes scripts foram criados para ajudar a manter o código limpo, organizado e livre de arquivos desnecessários.

## Scripts Disponíveis

### 📊 `project-health.js`

**Comando:** `npm run health`

Gera um relatório completo sobre a saúde do projeto, incluindo:
- Arquivos desnecessários ou temporários
- Arquivos duplicados
- Dependências não utilizadas
- Inconsistências de configuração
- Sugestões de melhoria

### 🧹 `cleanup.js`

**Comando:** `npm run cleanup`

Limpa arquivos temporários e caches do projeto:
- Remove o arquivo `tsconfig.tsbuildinfo`
- Limpa o cache do Next.js (`.next`)
- Remove diretórios de build (`out`, `build`)
- Limpa o cache do Node.js (`node_modules/.cache`)

### 🗑️ `clean-backups.js`

**Comando:** `npm run clean-backups`

Verifica e remove diretórios de backup antigos:
- Identifica a pasta `versões_anteriores`
- Calcula o espaço ocupado
- Permite remover esses backups após confirmação

### 📦 `check-unused-deps.js`

**Comando:** `npm run check-deps`

Identifica dependências potencialmente não utilizadas no projeto:
- Analisa as dependências listadas no `package.json`
- Verifica se estão sendo importadas no código
- Lista dependências que podem ser removidas

### 🔄 `check-duplicates.js`

**Comando:** `npm run check-dupes`

Encontra arquivos duplicados no projeto:
- Calcula o hash de cada arquivo
- Identifica arquivos com conteúdo idêntico
- Sugere quais podem ser removidos

### 📁 `organize-project.js`

**Comando:** `npm run organize`

Organiza os arquivos na raiz do projeto:
- Move arquivos de configuração para uma pasta `config`
- Move documentação para a pasta `docs`
- Atualiza referências nos arquivos quando necessário

## Como Usar

Para executar qualquer um desses scripts, use o comando npm correspondente. Por exemplo:

```bash
# Verificar a saúde do projeto
npm run health

# Limpar arquivos temporários
npm run cleanup

# Remover backups antigos
npm run clean-backups
```

## Notas

- Alguns scripts podem solicitar confirmação antes de realizar alterações permanentes
- É recomendável fazer um backup ou commit antes de executar scripts que modificam arquivos
- Os scripts foram projetados para funcionar tanto em ambientes Windows quanto Unix