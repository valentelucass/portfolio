/**
 * Script para atualizar o token do GitHub no arquivo .env.local
 * 
 * Uso: node scripts/update-github-token.js <novo_token>
 */

const fs = require('fs');
const path = require('path');

// Caminho para o arquivo .env.local
const envPath = path.join(process.cwd(), '.env.local');

// Obter o novo token da linha de comando
const newToken = process.argv[2];

if (!newToken) {
  console.error('❌ Erro: Token não fornecido');
  console.log('Uso: node scripts/update-github-token.js <novo_token>');
  console.log('\nVocê pode gerar um novo token em: https://github.com/settings/tokens');
  process.exit(1);
}

// Verificar se o arquivo .env.local existe
if (!fs.existsSync(envPath)) {
  console.error(`❌ Erro: Arquivo .env.local não encontrado em ${envPath}`);
  process.exit(1);
}

try {
  // Ler o conteúdo atual do arquivo
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar se já existe uma linha com GITHUB_TOKEN
  if (envContent.includes('GITHUB_TOKEN=')) {
    // Substituir o token existente
    envContent = envContent.replace(/GITHUB_TOKEN=.*/g, `GITHUB_TOKEN=${newToken}`);
  } else {
    // Adicionar o token no início do arquivo
    envContent = `GITHUB_TOKEN=${newToken}\n${envContent}`;
  }
  
  // Escrever o conteúdo atualizado de volta no arquivo
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Token do GitHub atualizado com sucesso!');
  console.log('🔄 Reinicie o servidor para aplicar as alterações.');
} catch (error) {
  console.error(`❌ Erro ao atualizar o token: ${error.message}`);
  process.exit(1);
}