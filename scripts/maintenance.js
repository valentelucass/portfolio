/**
 * Script de manutenção completa do projeto
 * Este script executa todos os scripts de manutenção em sequência
 */

const { execSync } = require('child_process');
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

// Função para executar um comando
function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído com sucesso!`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao ${description.toLowerCase()}:`, error.message);
    return false;
  }
}

// Função principal
async function runMaintenance() {
  console.log('🛠️  Iniciando manutenção completa do projeto...');
  
  const rl = createInterface();
  
  console.log('\n📋 Scripts de manutenção disponíveis:');
  console.log('1. Verificar saúde do projeto (health)');
  console.log('2. Limpar arquivos temporários (cleanup)');
  console.log('3. Verificar dependências não utilizadas (check-deps)');
  console.log('4. Verificar arquivos duplicados (check-dupes)');
  console.log('5. Limpar backups antigos (clean-backups)');
  console.log('6. Organizar arquivos do projeto (organize)');
  console.log('7. Executar todos os scripts');
  
  const answer = await askQuestion(
    rl,
    '\n🔢 Escolha uma opção (1-7): '
  );
  
  let success = false;
  
  switch (answer) {
    case '1':
      success = runCommand('npm run health', 'Verificar saúde do projeto');
      break;
    case '2':
      success = runCommand('npm run cleanup', 'Limpar arquivos temporários');
      break;
    case '3':
      success = runCommand('npm run check-deps', 'Verificar dependências não utilizadas');
      break;
    case '4':
      success = runCommand('npm run check-dupes', 'Verificar arquivos duplicados');
      break;
    case '5':
      success = runCommand('npm run clean-backups', 'Limpar backups antigos');
      break;
    case '6':
      success = runCommand('npm run organize', 'Organizar arquivos do projeto');
      break;
    case '7':
      console.log('\n🚀 Executando todos os scripts de manutenção...');
      
      // Primeiro verificamos a saúde do projeto
      success = runCommand('npm run health', 'Verificar saúde do projeto');
      
      if (success) {
        // Perguntamos se o usuário deseja continuar com as ações de limpeza
        const continueAnswer = await askQuestion(
          rl,
          '\n⚠️ Deseja continuar com as ações de limpeza e organização? (s/n): '
        );
        
        if (continueAnswer === 's' || continueAnswer === 'sim' || continueAnswer === 'y' || continueAnswer === 'yes') {
          // Executamos os scripts de limpeza
          runCommand('npm run cleanup', 'Limpar arquivos temporários');
          runCommand('npm run clean-backups', 'Limpar backups antigos');
          runCommand('npm run check-dupes', 'Verificar arquivos duplicados');
          
          // Perguntamos se o usuário deseja organizar os arquivos
          const organizeAnswer = await askQuestion(
            rl,
            '\n⚠️ Deseja organizar os arquivos do projeto? (s/n): '
          );
          
          if (organizeAnswer === 's' || organizeAnswer === 'sim' || organizeAnswer === 'y' || organizeAnswer === 'yes') {
            runCommand('npm run organize', 'Organizar arquivos do projeto');
          }
        }
      }
      break;
    default:
      console.log('❌ Opção inválida!');
      break;
  }
  
  rl.close();
  
  console.log('\n✨ Processo de manutenção finalizado!');
}

// Executar manutenção
runMaintenance();