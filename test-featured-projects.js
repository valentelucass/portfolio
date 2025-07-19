// Script para testar o sistema de projetos em destaque
console.log('🧪 Testando sistema de projetos em destaque...')

// Simula limpeza do cache
if (typeof window !== 'undefined') {
  // Remove cache de projetos em destaque
  localStorage.removeItem('featured-projects-valentelucass')
  console.log('✅ Cache limpo')
  
  // Força recarregamento da página
  window.location.reload()
} else {
  console.log('❌ Este script deve ser executado no navegador')
}

console.log('📋 Para ver os logs de debug:')
console.log('1. Abra o DevTools (F12)')
console.log('2. Vá para a aba Console')
console.log('3. Recarregue a página')
console.log('4. Procure por logs começando com "Fetching featured projects"') 