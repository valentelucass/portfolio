/**
 * Script para verificar e remover backups antigos
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Função para criar interface de linha de comando
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Função para perguntar ao usuário
function askQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Função para remover diretório recursivamente
function removeDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          removeDirectory(filePath);
        } else {
          fs.unlinkSync(filePath);
          console.log(`✅ Arquivo removido: ${filePath}`);
        }
      }
      
      fs.rmdirSync(dirPath);
      console.log(`✅ Diretório removido: ${dirPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Erro ao remover diretório ${dirPath}:`, error.message);
    return false;
  }
}

// Função para verificar tamanho do diretório
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao calcular tamanho do diretório ${dirPath}:`, error.message);
  }
  
  return totalSize;
}

// Função para formatar tamanho em bytes para formato legível
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Função principal
async function cleanBackups() {
  console.log('🔍 Verificando backups antigos...');
  
  const backupDirs = [
    path.resolve(process.cwd(), 'versões_anteriores'),
  ];
  
  let totalSize = 0;
  const existingDirs = [];
  
  // Verificar diretórios de backup
  for (const dir of backupDirs) {
    if (fs.existsSync(dir)) {
      const dirSize = getDirectorySize(dir);
      totalSize += dirSize;
      
      existingDirs.push({
        path: dir,
        size: dirSize,
        formattedSize: formatSize(dirSize)
      });
    }
  }
  
  if (existingDirs.length === 0) {
    console.log('✅ Nenhum diretório de backup encontrado.');
    return;
  }
  
  // Exibir informações sobre os diretórios de backup
  console.log('\n📁 Diretórios de backup encontrados:');
  existingDirs.forEach(dir => {
    console.log(`- ${dir.path} (${dir.formattedSize})`);
  });
  
  console.log(`\n💾 Tamanho total: ${formatSize(totalSize)}`);
  
  // Perguntar ao usuário se deseja remover os diretórios
  const rl = createInterface();
  
  const answer = await askQuestion(
    rl,
    '\n⚠️ Deseja remover esses diretórios de backup? (s/n): '
  );
  
  if (answer === 's' || answer === 'sim' || answer === 'y' || answer === 'yes') {
    console.log('\n🗑️ Removendo diretórios de backup...');
    
    for (const dir of existingDirs) {
      const removed = removeDirectory(dir.path);
      if (removed) {
        console.log(`✅ Diretório removido: ${dir.path} (${dir.formattedSize})`);
      }
    }
    
    console.log(`\n✨ Limpeza concluída! Espaço liberado: ${formatSize(totalSize)}`);
  } else {
    console.log('\n❌ Operação cancelada pelo usuário.');
  }
  
  rl.close();
}

// Executar limpeza
cleanBackups();