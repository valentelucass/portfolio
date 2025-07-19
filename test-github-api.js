// Teste direto da API do GitHub
async function testGitHubAPI() {
  console.log('🧪 Testando API do GitHub...')
  
  const username = 'valentelucass'
  const repoName = 'home-service'
  
  try {
    // Teste 1: Buscar repositório específico
    console.log('📋 Teste 1: Buscando repositório específico...')
    const repoResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`)
    
    if (repoResponse.ok) {
      const repo = await repoResponse.json()
      console.log('✅ Repositório encontrado:', repo.name)
      console.log('📝 Descrição:', repo.description)
      console.log('🏠 Homepage:', repo.homepage)
      console.log('⭐ Stars:', repo.stargazers_count)
    } else {
      console.log('❌ Erro ao buscar repositório:', repoResponse.status, repoResponse.statusText)
      return
    }
    
    // Teste 2: Buscar README
    console.log('\n📋 Teste 2: Buscando README...')
    const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`)
    
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json()
      const readmeContent = atob(readmeData.content)
      console.log('✅ README encontrado')
      console.log('📏 Tamanho do README:', readmeContent.length, 'caracteres')
      console.log('🔍 Contém PORTFOLIO-FEATURED:', readmeContent.includes('<!-- PORTFOLIO-FEATURED -->'))
      
      // Mostrar primeiras linhas do README
      const lines = readmeContent.split('\n')
      console.log('\n📄 Primeiras 10 linhas do README:')
      lines.slice(0, 10).forEach((line, i) => {
        console.log(`${i + 1}: ${line}`)
      })
      
      // Procurar por informações específicas
      const hasDescription = readmeContent.includes('**Descrição:**')
      const hasTechnologies = readmeContent.includes('**Tecnologias:**')
      const hasDemo = readmeContent.includes('**Demo:**')
      const hasHighlight = readmeContent.includes('**Destaque:**')
      const hasImage = readmeContent.includes('**Imagem:**')
      
      console.log('\n🔍 Informações encontradas:')
      console.log('Descrição:', hasDescription ? '✅' : '❌')
      console.log('Tecnologias:', hasTechnologies ? '✅' : '❌')
      console.log('Demo:', hasDemo ? '✅' : '❌')
      console.log('Destaque:', hasHighlight ? '✅' : '❌')
      console.log('Imagem:', hasImage ? '✅' : '❌')
      
    } else {
      console.log('❌ Erro ao buscar README:', readmeResponse.status, readmeResponse.statusText)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Executar teste se estiver no navegador
if (typeof window !== 'undefined') {
  testGitHubAPI()
} else {
  console.log('❌ Este script deve ser executado no navegador')
}

console.log('\n📋 Para executar o teste:')
console.log('1. Abra o DevTools (F12)')
console.log('2. Vá para a aba Console')
console.log('3. Cole este código e pressione Enter')
console.log('4. Ou execute: testGitHubAPI()') 