/**
 * Script para verificar dependências não utilizadas no projeto
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para obter todas as dependências do package.json
function getDependencies() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies };
  const devDependencies = { ...packageJson.devDependencies };
  
  return { dependencies, devDependencies };
}

// Função para verificar se uma dependência é usada no código
function checkDependencyUsage(dependency) {
  try {
    // Ignorar dependências internas do Next.js e React
    if (['next', 'react', 'react-dom'].includes(dependency)) {
      return true;
    }
    
    // Verificar se a dependência é importada em algum arquivo
    const result = execSync(
      `findstr /s /i /m "from ['\"]${dependency}['\"]" .\app .\components .\lib .\hooks .\types`,
      { stdio: 'pipe', encoding: 'utf8' }
    );
    
    return result.trim().length > 0;
  } catch (error) {
    // Se o comando findstr não encontrar nada, ele retorna código de erro
    return false;
  }
}

// Função principal
function checkUnusedDependencies() {
  console.log('🔍 Verificando dependências não utilizadas...');
  
  const { dependencies, devDependencies } = getDependencies();
  
  console.log('\n📦 Verificando dependências de produção:');
  const unusedDeps = [];
  
  for (const dep in dependencies) {
    const isUsed = checkDependencyUsage(dep);
    if (!isUsed) {
      unusedDeps.push(dep);
      console.log(`❌ ${dep}: Possivelmente não utilizada`);
    } else {
      console.log(`✅ ${dep}: Em uso`);
    }
  }
  
  console.log('\n🛠️ Verificando dependências de desenvolvimento:');
  const unusedDevDeps = [];
  
  for (const dep in devDependencies) {
    // Ignorar dependências de desenvolvimento comuns
    if (['typescript', 'eslint', 'prettier', '@types/react', '@types/node'].includes(dep)) {
      console.log(`✅ ${dep}: Dependência de desenvolvimento comum`);
      continue;
    }
    
    const isUsed = checkDependencyUsage(dep);
    if (!isUsed) {
      unusedDevDeps.push(dep);
      console.log(`❌ ${dep}: Possivelmente não utilizada`);
    } else {
      console.log(`✅ ${dep}: Em uso`);
    }
  }
  
  console.log('\n📊 Resumo:');
  console.log(`Total de dependências: ${Object.keys(dependencies).length + Object.keys(devDependencies).length}`);
  console.log(`Possivelmente não utilizadas: ${unusedDeps.length + unusedDevDeps.length}`);
  
  if (unusedDeps.length > 0 || unusedDevDeps.length > 0) {
    console.log('\n⚠️ Comando para remover dependências não utilizadas:');
    
    if (unusedDeps.length > 0) {
      console.log(`npm uninstall ${unusedDeps.join(' ')}`);
    }
    
    if (unusedDevDeps.length > 0) {
      console.log(`npm uninstall --save-dev ${unusedDevDeps.join(' ')}`);
    }
  } else {
    console.log('\n✅ Todas as dependências parecem estar em uso!');
  }
}

// Executar verificação
checkUnusedDependencies();