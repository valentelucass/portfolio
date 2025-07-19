// Debug específico para o README do home-service
async function debugHomeServiceREADME() {
  console.log('🔍 Debug específico para home-service...')
  
  try {
    // 1. Buscar o repositório
    const repoResponse = await fetch('https://api.github.com/repos/valentelucass/home-service')
    
    if (!repoResponse.ok) {
      console.log('❌ Repositório não encontrado:', repoResponse.status)
      return
    }
    
    const repo = await repoResponse.json()
    console.log('✅ Repositório encontrado:', repo.name)
    
    // 2. Buscar o README
    const readmeResponse = await fetch('https://api.github.com/repos/valentelucass/home-service/readme')
    
    if (!readmeResponse.ok) {
      console.log('❌ README não encontrado:', readmeResponse.status)
      return
    }
    
    const readmeData = await readmeResponse.json()
    const readmeContent = atob(readmeData.content)
    
    console.log('✅ README encontrado')
    console.log('📏 Tamanho:', readmeContent.length, 'caracteres')
    
    // 3. Verificar se contém a tag
    const hasTag = readmeContent.includes('<!-- PORTFOLIO-FEATURED -->')
    console.log('🏷️ Contém PORTFOLIO-FEATURED:', hasTag)
    
    if (!hasTag) {
      console.log('❌ Tag não encontrada! Adicione <!-- PORTFOLIO-FEATURED --> no README')
      return
    }
    
    // 4. Mostrar a seção onde está a tag
    const lines = readmeContent.split('\n')
    let tagLineIndex = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<!-- PORTFOLIO-FEATURED -->')) {
        tagLineIndex = i
        break
      }
    }
    
    if (tagLineIndex !== -1) {
      console.log('📍 Tag encontrada na linha:', tagLineIndex + 1)
      console.log('📄 Contexto (5 linhas antes e depois):')
      
      const start = Math.max(0, tagLineIndex - 5)
      const end = Math.min(lines.length, tagLineIndex + 6)
      
      for (let i = start; i < end; i++) {
        const marker = i === tagLineIndex ? '>>> ' : '    '
        console.log(`${marker}${i + 1}: ${lines[i]}`)
      }
    }
    
    // 5. Verificar se as informações estão presentes
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
    
    // 6. Testar o parser
    console.log('\n🧪 Testando parser...')
    
    // Simular o que o parser faria
    const endSection = readmeContent.split('---').pop() || ''
    const endLines = endSection.split('\n')
    
    let foundDescription = ''
    let foundTechnologies = []
    let foundDemo = ''
    let foundHighlight = ''
    let foundImage = ''
    
    for (const line of endLines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.includes('**Descrição:**')) {
        foundDescription = trimmedLine.replace('**Descrição:**', '').trim()
      } else if (trimmedLine.includes('**Tecnologias:**')) {
        const techLine = trimmedLine.replace('**Tecnologias:**', '').trim()
        foundTechnologies = techLine.split(',').map(t => t.trim())
      } else if (trimmedLine.includes('**Demo:**')) {
        foundDemo = trimmedLine.replace('**Demo:**', '').trim()
      } else if (trimmedLine.includes('**Destaque:**')) {
        foundHighlight = trimmedLine.replace('**Destaque:**', '').trim()
      } else if (trimmedLine.includes('**Imagem:**')) {
        foundImage = trimmedLine.replace('**Imagem:**', '').trim()
      }
    }
    
    console.log('📝 Parser encontrou:')
    console.log('Descrição:', foundDescription || 'N/A')
    console.log('Tecnologias:', foundTechnologies.length > 0 ? foundTechnologies : 'N/A')
    console.log('Demo:', foundDemo || 'N/A')
    console.log('Destaque:', foundHighlight || 'N/A')
    console.log('Imagem:', foundImage || 'N/A')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

// Executar se estiver no navegador
if (typeof window !== 'undefined') {
  debugHomeServiceREADME()
} else {
  console.log('❌ Execute no console do navegador')
}

console.log('\n📋 Para executar:')
console.log('1. Abra DevTools (F12)')
console.log('2. Vá para Console')
console.log('3. Cole este código e pressione Enter')
console.log('4. Ou execute: debugHomeServiceREADME()') 