/**
 * Script para organizar os arquivos na raiz do projeto
 */

const fs = require('fs');
const path = require('path');

// Função para criar diretório se não existir
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Diretório criado: ${dirPath}`);
  }
}

// Função para mover arquivo
function moveFile(source, destination) {
  try {
    if (fs.existsSync(source)) {
      // Garantir que o diretório de destino existe
      const destDir = path.dirname(destination);
      ensureDirectoryExists(destDir);
      
      // Copiar o arquivo
      fs.copyFileSync(source, destination);
      
      // Remover o arquivo original
      fs.unlinkSync(source);
      
      console.log(`✅ Arquivo movido: ${source} -> ${destination}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Erro ao mover arquivo ${source}:`, error.message);
    return false;
  }
}

// Função para atualizar referências em arquivos
function updateReferences(filePath, oldPath, newPath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const updatedContent = content.replace(new RegExp(oldPath, 'g'), newPath);
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Referências atualizadas em: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao atualizar referências em ${filePath}:`, error.message);
  }
}

// Função principal
function organizeProject() {
  console.log('🚀 Iniciando organização do projeto...');
  
  // Criar diretório para arquivos de configuração
  const configDir = path.resolve(process.cwd(), 'config');
  ensureDirectoryExists(configDir);
  
  // Criar diretório para documentação
  const docsDir = path.resolve(process.cwd(), 'docs');
  ensureDirectoryExists(docsDir);
  
  // Arquivos a serem movidos para a pasta config
  const configFiles = [
    // { source: '.eslintrc.json', destination: 'config/.eslintrc.json' },
    // { source: '.prettierrc', destination: 'config/.prettierrc' },
    // { source: 'postcss.config.mjs', destination: 'config/postcss.config.mjs' },
    // { source: 'tailwind.config.ts', destination: 'config/tailwind.config.ts' },
  ];
  
  // Arquivos a serem movidos para a pasta docs
  const docFiles = [
    { source: 'TODOS_STATUS.md', destination: 'docs/TODOS_STATUS.md' },
  ];
  
  // Mover arquivos de configuração
  console.log('\n📄 Movendo arquivos de configuração...');
  configFiles.forEach(file => {
    moveFile(
      path.resolve(process.cwd(), file.source),
      path.resolve(process.cwd(), file.destination)
    );
  });
  
  // Mover arquivos de documentação
  console.log('\n📄 Movendo arquivos de documentação...');
  docFiles.forEach(file => {
    moveFile(
      path.resolve(process.cwd(), file.source),
      path.resolve(process.cwd(), file.destination)
    );
  });
  
  console.log('\n✨ Organização concluída!');
}

// Executar organização
organizeProject();