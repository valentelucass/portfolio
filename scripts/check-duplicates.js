/**
 * Script para verificar e remover arquivos duplicados ou desnecessários
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Função para calcular o hash de um arquivo
function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`❌ Erro ao calcular hash do arquivo ${filePath}:`, error.message);
    return null;
  }
}

// Função para verificar se um arquivo é desnecessário
function isUnnecessaryFile(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  const unnecessaryFiles = [
    '.ds_store',
    'thumbs.db',
    'desktop.ini',
    '.directory',
  ];
  
  return unnecessaryFiles.includes(fileName);
}

// Função para verificar se um arquivo é temporário
function isTemporaryFile(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  return (
    fileName.endsWith('.tmp') ||
    fileName.endsWith('.temp') ||
    fileName.endsWith('.bak') ||
    fileName.endsWith('.log') ||
    fileName.startsWith('~$')
  );
}

// Função para verificar arquivos em um diretório recursivamente
function scanDirectory(dir, fileMap = {}, hashMap = {}, unnecessaryFiles = [], tempFiles = []) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Ignorar diretórios específicos
        if (['node_modules', '.git', '.next', 'out', 'build'].includes(item)) {
          continue;
        }
        
        // Escanear subdiretório recursivamente
        scanDirectory(itemPath, fileMap, hashMap, unnecessaryFiles, tempFiles);
      } else if (stats.isFile()) {
        // Verificar se é um arquivo desnecessário
        if (isUnnecessaryFile(itemPath)) {
          unnecessaryFiles.push(itemPath);
          continue;
        }
        
        // Verificar se é um arquivo temporário
        if (isTemporaryFile(itemPath)) {
          tempFiles.push(itemPath);
          continue;
        }
        
        // Calcular hash do arquivo para verificar duplicatas
        const fileHash = calculateFileHash(itemPath);
        if (fileHash) {
          if (!hashMap[fileHash]) {
            hashMap[fileHash] = [];
          }
          hashMap[fileHash].push(itemPath);
        }
        
        // Agrupar por nome de arquivo
        const fileName = path.basename(itemPath);
        if (!fileMap[fileName]) {
          fileMap[fileName] = [];
        }
        fileMap[fileName].push(itemPath);
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao escanear diretório ${dir}:`, error.message);
  }
  
  return { fileMap, hashMap, unnecessaryFiles, tempFiles };
}

// Função principal
function checkDuplicates() {
  console.log('🔍 Verificando arquivos duplicados e desnecessários...');
  
  const rootDir = process.cwd();
  const { fileMap, hashMap, unnecessaryFiles, tempFiles } = scanDirectory(rootDir);
  
  // Verificar arquivos com mesmo nome
  console.log('\n📄 Arquivos com mesmo nome em diferentes diretórios:');
  let hasSameNameFiles = false;
  
  for (const [fileName, filePaths] of Object.entries(fileMap)) {
    if (filePaths.length > 1) {
      hasSameNameFiles = true;
      console.log(`\n⚠️ ${fileName} (${filePaths.length} ocorrências):`);
      filePaths.forEach(filePath => {
        console.log(`   - ${path.relative(rootDir, filePath)}`);
      });
    }
  }
  
  if (!hasSameNameFiles) {
    console.log('✅ Nenhum arquivo com mesmo nome encontrado em diferentes diretórios.');
  }
  
  // Verificar arquivos duplicados (mesmo conteúdo)
  console.log('\n📄 Arquivos duplicados (mesmo conteúdo):');
  let hasDuplicates = false;
  
  for (const [fileHash, filePaths] of Object.entries(hashMap)) {
    if (filePaths.length > 1) {
      hasDuplicates = true;
      console.log(`\n⚠️ Hash: ${fileHash.substring(0, 8)}... (${filePaths.length} duplicatas):`);
      filePaths.forEach(filePath => {
        console.log(`   - ${path.relative(rootDir, filePath)}`);
      });
    }
  }
  
  if (!hasDuplicates) {
    console.log('✅ Nenhum arquivo duplicado encontrado.');
  }
  
  // Verificar arquivos desnecessários
  console.log('\n📄 Arquivos desnecessários:');
  if (unnecessaryFiles.length > 0) {
    unnecessaryFiles.forEach(filePath => {
      console.log(`❌ ${path.relative(rootDir, filePath)}`);
    });
  } else {
    console.log('✅ Nenhum arquivo desnecessário encontrado.');
  }
  
  // Verificar arquivos temporários
  console.log('\n📄 Arquivos temporários:');
  if (tempFiles.length > 0) {
    tempFiles.forEach(filePath => {
      console.log(`❌ ${path.relative(rootDir, filePath)}`);
    });
  } else {
    console.log('✅ Nenhum arquivo temporário encontrado.');
  }
  
  // Resumo
  console.log('\n📊 Resumo:');
  console.log(`Total de arquivos com mesmo nome: ${Object.values(fileMap).filter(paths => paths.length > 1).length}`);
  console.log(`Total de arquivos duplicados: ${Object.values(hashMap).filter(paths => paths.length > 1).length}`);
  console.log(`Total de arquivos desnecessários: ${unnecessaryFiles.length}`);
  console.log(`Total de arquivos temporários: ${tempFiles.length}`);
}

// Executar verificação
checkDuplicates();