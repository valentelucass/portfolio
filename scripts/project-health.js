/**
 * Script para verificar a saúde do projeto
 * Este script analisa o projeto e gera um relatório com informações sobre:
 * - Arquivos desnecessários
 * - Inconsistências
 * - Dependências não utilizadas
 * - Arquivos duplicados
 * - Sugestões de melhoria
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Configurações
const config = {
  // Diretórios a serem ignorados na análise
  ignoreDirs: [
    'node_modules',
    '.next',
    'out',
    'build',
    'dist',
    '.git',
    'versões_anteriores'
  ],
  // Extensões de arquivos a serem analisados
  fileExtensions: [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
    '.json',
    '.md',
    '.html'
  ],
  // Arquivos que podem ser considerados desnecessários
  potentialUnnecessaryFiles: [
    'Thumbs.db',
    '.DS_Store',
    '*.log',
    '*.tmp',
    'tsconfig.tsbuildinfo',
    '.eslintcache'
  ],
  // Padrões de arquivos temporários
  tempFilePatterns: [
    /^~.+$/,          // Arquivos temporários que começam com ~
    /^\..+\.sw[a-z]$/, // Arquivos de swap do Vim
    /^\..+\.un~$/,    // Arquivos de undo do Vim
    /^\..+\.bak$/     // Arquivos de backup
  ]
};

// Função para verificar se um diretório deve ser ignorado
function shouldIgnoreDir(dirPath) {
  const dirName = path.basename(dirPath);
  return config.ignoreDirs.includes(dirName) || dirName.startsWith('.');
}

// Função para verificar se um arquivo deve ser analisado
function shouldAnalyzeFile(filePath) {
  const ext = path.extname(filePath);
  return config.fileExtensions.includes(ext);
}

// Função para verificar se um arquivo é potencialmente desnecessário
function isPotentiallyUnnecessary(filePath) {
  const fileName = path.basename(filePath);
  
  // Verificar padrões de arquivos temporários
  for (const pattern of config.tempFilePatterns) {
    if (pattern.test(fileName)) {
      return true;
    }
  }
  
  // Verificar lista de arquivos desnecessários
  for (const pattern of config.potentialUnnecessaryFiles) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      if (regex.test(fileName)) {
        return true;
      }
    } else if (fileName === pattern) {
      return true;
    }
  }
  
  return false;
}

// Função para calcular o hash de um arquivo
function calculateFileHash(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileContent).digest('hex');
  } catch (error) {
    console.error(`Erro ao calcular hash do arquivo ${filePath}:`, error.message);
    return null;
  }
}

// Função para verificar arquivos duplicados
function findDuplicateFiles(directory) {
  const fileHashes = {};
  const duplicates = [];
  
  function scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          if (!shouldIgnoreDir(fullPath)) {
            scanDirectory(fullPath);
          }
        } else if (stats.isFile()) {
          const hash = calculateFileHash(fullPath);
          
          if (hash) {
            if (fileHashes[hash]) {
              duplicates.push({
                original: fileHashes[hash],
                duplicate: fullPath,
                size: stats.size
              });
            } else {
              fileHashes[hash] = fullPath;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao escanear diretório ${dir}:`, error.message);
    }
  }
  
  scanDirectory(directory);
  return duplicates;
}

// Função para verificar arquivos desnecessários
function findUnnecessaryFiles(directory) {
  const unnecessaryFiles = [];
  
  function scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          if (!shouldIgnoreDir(fullPath)) {
            scanDirectory(fullPath);
          }
        } else if (stats.isFile()) {
          if (isPotentiallyUnnecessary(fullPath)) {
            unnecessaryFiles.push({
              path: fullPath,
              size: stats.size
            });
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao escanear diretório ${dir}:`, error.message);
    }
  }
  
  scanDirectory(directory);
  return unnecessaryFiles;
}

// Função para verificar dependências não utilizadas
function checkUnusedDependencies() {
  try {
    // Ler o arquivo package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    // Lista de dependências que podem ser falsamente reportadas como não utilizadas
    const commonFalsePositives = [
      'react',
      'react-dom',
      'next',
      '@types/react',
      '@types/node',
      'typescript',
      'eslint',
      'prettier',
      'autoprefixer',
      'postcss',
      'tailwindcss'
    ];
    
    // Filtrar dependências comuns que não devem ser reportadas
    const filteredDependencies = Object.keys(dependencies).filter(
      dep => !commonFalsePositives.includes(dep)
    );
    
    const filteredDevDependencies = Object.keys(devDependencies).filter(
      dep => !commonFalsePositives.includes(dep)
    );
    
    // Verificar uso das dependências no código
    const unusedDependencies = [];
    const unusedDevDependencies = [];
    
    // Abordagem simplificada para evitar problemas com findstr no Windows
    const projectRoot = process.cwd();
    const sourceFiles = [];
    const dirsToCheck = ['app', 'components', 'lib', 'hooks', 'styles', 'types', 'src', 'pages'];
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    
    // Coletar todos os arquivos de código-fonte
    dirsToCheck.forEach(dir => {
      const dirPath = path.join(projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        try {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isFile() && extensions.some(ext => file.endsWith(ext))) {
              sourceFiles.push(filePath);
            } else if (fs.statSync(filePath).isDirectory()) {
              // Verificar subdiretórios de primeiro nível
              try {
                const subFiles = fs.readdirSync(filePath);
                subFiles.forEach(subFile => {
                  const subFilePath = path.join(filePath, subFile);
                  if (fs.statSync(subFilePath).isFile() && extensions.some(ext => subFile.endsWith(ext))) {
                    sourceFiles.push(subFilePath);
                  }
                });
              } catch (error) {
                // Ignorar erros de leitura de subdiretório
              }
            }
          });
        } catch (error) {
          // Ignorar erros de leitura de diretório
        }
      }
    });
    
    // Verificar cada dependência
    for (const dep of filteredDependencies) {
      let found = false;
      
      // Verificar em package.json primeiro (pode ser usado em scripts)
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      if (packageJsonContent.includes(`"${dep}"`) || packageJsonContent.includes(`'${dep}'`)) {
        found = true;
        continue;
      }
      
      // Verificar em arquivos de código-fonte
      for (const file of sourceFiles) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes(dep)) {
            found = true;
            break;
          }
        } catch (error) {
          // Ignorar erros de leitura de arquivo
        }
      }
      
      if (!found) {
        unusedDependencies.push(dep);
      }
    }
    
    // Não verificamos devDependencies com a mesma intensidade, pois muitas são usadas indiretamente
    
    return {
      unusedDependencies,
      unusedDevDependencies
    };
  } catch (error) {
    console.error('Erro ao verificar dependências não utilizadas:', error.message);
    return {
      unusedDependencies: [],
      unusedDevDependencies: []
    };
  }
}

// Função para verificar inconsistências no projeto
function checkProjectInconsistencies() {
  const inconsistencies = [];
  
  // Verificar arquivos de configuração duplicados
  const configFiles = {
    eslint: ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml'],
    prettier: ['.prettierrc', '.prettierrc.js', '.prettierrc.json', '.prettierrc.yml'],
    typescript: ['tsconfig.json', 'tsconfig.base.json'],
    babel: ['.babelrc', '.babelrc.js', 'babel.config.js']
  };
  
  for (const [tool, files] of Object.entries(configFiles)) {
    const foundFiles = files.filter(file => fs.existsSync(path.join(process.cwd(), file)));
    
    if (foundFiles.length > 1) {
      inconsistencies.push({
        type: 'duplicate_config',
        tool,
        files: foundFiles
      });
    }
  }
  
  // Verificar package.json e package-lock.json/yarn.lock inconsistências
  const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
  const hasPackageLock = fs.existsSync(path.join(process.cwd(), 'package-lock.json'));
  const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));
  const hasPnpmLock = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'));
  
  if (hasPackageJson) {
    // Verificar múltiplos arquivos de lock
    const lockFiles = [];
    if (hasPackageLock) lockFiles.push('package-lock.json');
    if (hasYarnLock) lockFiles.push('yarn.lock');
    if (hasPnpmLock) lockFiles.push('pnpm-lock.yaml');
    
    if (lockFiles.length > 1) {
      inconsistencies.push({
        type: 'multiple_lock_files',
        files: lockFiles
      });
    }
  }
  
  return inconsistencies;
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

// Função principal para gerar o relatório de saúde do projeto
async function generateProjectHealthReport() {
  console.log('🔍 Analisando a saúde do projeto...');
  
  const projectRoot = process.cwd();
  const reportData = {};
  
  // 1. Verificar arquivos desnecessários
  console.log('\n📁 Verificando arquivos desnecessários...');
  const unnecessaryFiles = findUnnecessaryFiles(projectRoot);
  reportData.unnecessaryFiles = unnecessaryFiles;
  
  // 2. Verificar arquivos duplicados
  console.log('\n🔄 Verificando arquivos duplicados...');
  const duplicateFiles = findDuplicateFiles(projectRoot);
  reportData.duplicateFiles = duplicateFiles;
  
  // 3. Verificar dependências não utilizadas
  console.log('\n📦 Verificando dependências não utilizadas...');
  const unusedDeps = checkUnusedDependencies();
  reportData.unusedDependencies = unusedDeps;
  
  // 4. Verificar inconsistências no projeto
  console.log('\n⚠️ Verificando inconsistências no projeto...');
  const inconsistencies = checkProjectInconsistencies();
  reportData.inconsistencies = inconsistencies;
  
  // Gerar relatório
  console.log('\n📊 Gerando relatório de saúde do projeto...');
  
  // Relatório de arquivos desnecessários
  if (unnecessaryFiles.length > 0) {
    console.log('\n🗑️ Arquivos potencialmente desnecessários:');
    let totalSize = 0;
    
    unnecessaryFiles.forEach(file => {
      console.log(`- ${file.path} (${formatSize(file.size)})`);
      totalSize += file.size;
    });
    
    console.log(`\nTotal: ${unnecessaryFiles.length} arquivos (${formatSize(totalSize)})`);
  } else {
    console.log('\n✅ Nenhum arquivo desnecessário encontrado.');
  }
  
  // Relatório de arquivos duplicados
  if (duplicateFiles.length > 0) {
    console.log('\n🔄 Arquivos duplicados:');
    let totalSize = 0;
    
    duplicateFiles.forEach(file => {
      console.log(`- Original: ${file.original}`);
      console.log(`  Duplicado: ${file.duplicate} (${formatSize(file.size)})`);
      totalSize += file.size;
    });
    
    console.log(`\nTotal: ${duplicateFiles.length} arquivos duplicados (${formatSize(totalSize)})`);
  } else {
    console.log('\n✅ Nenhum arquivo duplicado encontrado.');
  }
  
  // Relatório de dependências não utilizadas
  if (unusedDeps.unusedDependencies.length > 0) {
    console.log('\n📦 Dependências potencialmente não utilizadas:');
    
    unusedDeps.unusedDependencies.forEach(dep => {
      console.log(`- ${dep}`);
    });
    
    console.log(`\nTotal: ${unusedDeps.unusedDependencies.length} dependências`);
  } else {
    console.log('\n✅ Nenhuma dependência não utilizada encontrada.');
  }
  
  // Relatório de inconsistências
  if (inconsistencies.length > 0) {
    console.log('\n⚠️ Inconsistências encontradas:');
    
    inconsistencies.forEach(inconsistency => {
      if (inconsistency.type === 'duplicate_config') {
        console.log(`- Configurações duplicadas para ${inconsistency.tool}: ${inconsistency.files.join(', ')}`);
      } else if (inconsistency.type === 'multiple_lock_files') {
        console.log(`- Múltiplos arquivos de lock encontrados: ${inconsistency.files.join(', ')}`);
      }
    });
    
    console.log(`\nTotal: ${inconsistencies.length} inconsistências`);
  } else {
    console.log('\n✅ Nenhuma inconsistência encontrada.');
  }
  
  // Sugestões de melhoria
  console.log('\n💡 Sugestões de melhoria:');
  
  const suggestions = [];
  
  if (unnecessaryFiles.length > 0) {
    suggestions.push('- Remova arquivos temporários e desnecessários para reduzir o tamanho do projeto.');
  }
  
  if (duplicateFiles.length > 0) {
    suggestions.push('- Elimine arquivos duplicados para manter o projeto organizado.');
  }
  
  if (unusedDeps.unusedDependencies.length > 0) {
    suggestions.push('- Remova dependências não utilizadas para reduzir o tamanho do node_modules.');
  }
  
  if (inconsistencies.length > 0) {
    suggestions.push('- Resolva inconsistências de configuração para evitar comportamentos inesperados.');
  }
  
  // Verificar se existe a pasta versões_anteriores
  if (fs.existsSync(path.join(projectRoot, 'versões_anteriores'))) {
    suggestions.push('- Remova a pasta "versões_anteriores" e utilize um sistema de controle de versão como o Git.');
  }
  
  // Verificar se existe a pasta diagnostics
  if (fs.existsSync(path.join(projectRoot, 'diagnostics'))) {
    suggestions.push('- Considere mover os arquivos de diagnóstico para a pasta "docs" ou remova-os se não forem mais necessários.');
  }
  
  // Verificar se existem múltiplos arquivos de lock
  if (fs.existsSync(path.join(projectRoot, 'package-lock.json')) && fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    suggestions.push('- Escolha um único gerenciador de pacotes (npm ou pnpm) e remova o arquivo de lock não utilizado.');
  }
  
  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      console.log(suggestion);
    });
  } else {
    console.log('- Seu projeto parece estar em bom estado! Continue mantendo-o organizado.');
  }
  
  console.log('\n✨ Relatório de saúde do projeto concluído!');
}

// Executar o relatório de saúde do projeto
generateProjectHealthReport();