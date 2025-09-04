/**
 * Script para limpar arquivos temporários e desnecessários do projeto
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Arquivos temporários que podem ser removidos
const tempFilesToRemove = [
  'tsconfig.tsbuildinfo',
];

// Diretórios que podem ser limpos
const dirsToClean = [
  '.next',
  'out',
  'build',
  'node_modules/.cache',
];

// Função para remover arquivos
function removeFiles(files) {
  files.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`✅ Arquivo removido: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao remover arquivo ${file}:`, error.message);
    }
  });
}

// Função para limpar diretórios
function cleanDirectories(directories) {
  directories.forEach(dir => {
    const dirPath = path.resolve(process.cwd(), dir);
    try {
      if (fs.existsSync(dirPath)) {
        console.log(`🧹 Limpando diretório: ${dir}`);
        // No Windows, usamos o comando rd /s /q para remover diretórios
        if (process.platform === 'win32') {
          execSync(`rd /s /q "${dirPath}"`, { stdio: 'inherit' });
          // Recriamos o diretório vazio
          fs.mkdirSync(dirPath, { recursive: true });
        } else {
          // Em sistemas Unix, usamos rm -rf
          execSync(`rm -rf "${dirPath}"`, { stdio: 'inherit' });
          // Recriamos o diretório vazio
          fs.mkdirSync(dirPath, { recursive: true });
        }
        console.log(`✅ Diretório limpo: ${dir}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao limpar diretório ${dir}:`, error.message);
    }
  });
}

// Função principal
function cleanup() {
  console.log('🚀 Iniciando limpeza do projeto...');
  
  // Remover arquivos temporários
  console.log('\n📄 Removendo arquivos temporários...');
  removeFiles(tempFilesToRemove);
  
  // Limpar diretórios de cache
  console.log('\n📁 Limpando diretórios de cache...');
  cleanDirectories(dirsToClean);
  
  console.log('\n✨ Limpeza concluída!');
}

// Executar limpeza
cleanup();