/**
 * CORREÇÕES CSS AUTOMÁTICAS
 * 
 * Este arquivo contém funções para aplicar correções CSS automaticamente
 * e resolver problemas de cores que voltam ao estado anterior.
 */

// FUNÇÃO PARA APLICAR CORREÇÕES CSS
export function applyCSSFixes() {
  if (typeof window === 'undefined') return;
  
  console.log('🔧 APLICANDO CORREÇÕES CSS...');
  
  // 1. Adicionar CSS de correções
  const cssFixes = `
    /* CORREÇÕES AUTOMÁTICAS APLICADAS */
    
    /* Garantir valores padrão para variáveis CSS */
    :root {
      --foreground: 210 40% 8% !important;
      --muted-foreground: 215 16% 47% !important;
      --background: 0 0% 100% !important;
      --accent-foreground: 210 40% 8% !important;
    }
    
    .dark {
      --foreground: 210 40% 98% !important;
      --muted-foreground: 215 20% 65% !important;
      --background: 222 84% 5% !important;
      --accent-foreground: 210 40% 98% !important;
    }
    
    /* Classes específicas para elementos problemáticos */
    .name-andrade {
      color: hsl(var(--foreground)) !important;
      font-weight: 600 !important;
      transition: color 0.3s ease !important;
    }
    
    .text-info {
      color: hsl(var(--muted-foreground)) !important;
      transition: color 0.3s ease !important;
    }
    
    .btn-text {
      color: hsl(var(--accent-foreground)) !important;
      transition: color 0.3s ease !important;
    }
    
    /* Correções específicas para elementos identificados */
    span.text-foreground {
      color: hsl(var(--foreground)) !important;
      transition: color 0.3s ease !important;
    }
    
    p.text-muted-foreground {
      color: hsl(var(--muted-foreground)) !important;
      transition: color 0.3s ease !important;
    }
    
    button.text-zinc-300 {
      color: hsl(var(--accent-foreground)) !important;
      transition: color 0.3s ease !important;
    }
    
    /* Prevenir mudanças inesperadas */
    .text-foreground,
    .text-muted-foreground,
    .text-zinc-300 {
      transition: color 0.3s ease !important;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = cssFixes;
  style.id = 'css-fixes-applied';
  document.head.appendChild(style);
  
  console.log('✅ CSS DE CORREÇÕES APLICADO');
}

// FUNÇÃO PARA APLICAR CLASSES ESPECÍFICAS AOS ELEMENTOS
export function applySpecificClasses() {
  if (typeof window === 'undefined') return;
  
  console.log('🎨 APLICANDO CLASSES ESPECÍFICAS...');
  
  // 1. Aplicar classe específica ao nome "Andrade"
  const andradeElements = document.querySelectorAll('span.text-foreground');
  andradeElements.forEach(element => {
    if (element.textContent.includes('Andrade')) {
      element.classList.add('name-andrade');
      console.log('✅ Classe name-andrade aplicada ao elemento:', element);
    }
  });
  
  // 2. Aplicar classe específica aos textos informativos
  const infoElements = document.querySelectorAll('p.text-muted-foreground');
  infoElements.forEach(element => {
    element.classList.add('text-info');
    console.log('✅ Classe text-info aplicada ao elemento:', element);
  });
  
  // 3. Aplicar classe específica aos botões
  const buttonElements = document.querySelectorAll('button.text-zinc-300');
  buttonElements.forEach(element => {
    element.classList.add('btn-text');
    console.log('✅ Classe btn-text aplicada ao elemento:', element);
  });
  
  console.log('✅ CLASSES ESPECÍFICAS APLICADAS');
}

// FUNÇÃO PARA CORRIGIR CONFLITOS DE CSS
export function fixCSSConflicts() {
  if (typeof window === 'undefined') return;
  
  console.log('🔧 CORRIGINDO CONFLITOS DE CSS...');
  
  // 1. Garantir que as variáveis CSS tenham prioridade
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  // Verificar se as variáveis estão definidas
  const foreground = computedStyle.getPropertyValue('--foreground');
  const mutedForeground = computedStyle.getPropertyValue('--muted-foreground');
  
  if (!foreground || !mutedForeground) {
    console.log('⚠️ Variáveis CSS não encontradas, definindo valores padrão...');
    
    // Definir valores padrão se não existirem
    if (!foreground) {
      root.style.setProperty('--foreground', '210 40% 8%');
    }
    if (!mutedForeground) {
      root.style.setProperty('--muted-foreground', '215 16% 47%');
    }
  }
  
  console.log('✅ CONFLITOS DE CSS CORRIGIDOS');
}

// FUNÇÃO PARA MONITORAR E PREVENIR MUDANÇAS INESPERADAS
export function monitorAndPreventChanges() {
  if (typeof window === 'undefined') return null;
  
  console.log('👀 ATIVANDO MONITORAMENTO DE MUDANÇAS...');
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        
        // Verificar se é um elemento que estamos monitorando
        if (target.classList.contains('text-foreground') || 
            target.classList.contains('text-muted-foreground') ||
            target.classList.contains('text-zinc-300')) {
          
          // Aplicar correção imediatamente se necessário
          setTimeout(() => {
            const computedStyle = getComputedStyle(target);
            const currentColor = computedStyle.color;
            
            // Verificar se a cor mudou para um valor inesperado
            if (currentColor === 'rgb(0, 0, 0)' || currentColor === 'rgba(0, 0, 0, 1)') {
              console.log('🔄 Cor inesperada detectada, aplicando correção...');
              
              if (target.classList.contains('text-foreground')) {
                target.style.color = 'hsl(var(--foreground))';
              } else if (target.classList.contains('text-muted-foreground')) {
                target.style.color = 'hsl(var(--muted-foreground))';
              } else if (target.classList.contains('text-zinc-300')) {
                target.style.color = 'hsl(var(--accent-foreground))';
              }
            }
          }, 100);
        }
      }
    });
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
  
  console.log('✅ MONITORAMENTO ATIVADO');
  return observer;
}

// FUNÇÃO PARA VERIFICAR SE AS CORREÇÕES FORAM APLICADAS
export function verifyFixes() {
  if (typeof window === 'undefined') return null;
  
  console.log('🔍 VERIFICANDO SE AS CORREÇÕES FORAM APLICADAS...');
  
  const fixesApplied = {
    cssFixes: !!document.getElementById('css-fixes-applied'),
    specificClasses: {
      nameAndrade: document.querySelectorAll('.name-andrade').length,
      textInfo: document.querySelectorAll('.text-info').length,
      btnText: document.querySelectorAll('.btn-text').length
    },
    variables: {
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
      mutedForeground: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground')
    }
  };
  
  console.log('📊 STATUS DAS CORREÇÕES:', fixesApplied);
  
  if (fixesApplied.cssFixes && 
      fixesApplied.specificClasses.nameAndrade > 0 &&
      fixesApplied.specificClasses.textInfo > 0 &&
      fixesApplied.specificClasses.btnText > 0) {
    console.log('✅ TODAS AS CORREÇÕES FORAM APLICADAS COM SUCESSO!');
  } else {
    console.log('⚠️ ALGUMAS CORREÇÕES NÃO FORAM APLICADAS COMPLETAMENTE');
  }
  
  return fixesApplied;
}

// FUNÇÃO PRINCIPAL PARA APLICAR TODAS AS CORREÇÕES
export function applyAllFixes() {
  if (typeof window === 'undefined') return;
  
  console.log('🚀 INICIANDO APLICAÇÃO DE TODAS AS CORREÇÕES...');
  console.log('='.repeat(50));
  
  try {
    // 1. Aplicar correções CSS
    applyCSSFixes();
    
    // 2. Aplicar classes específicas
    applySpecificClasses();
    
    // 3. Corrigir conflitos
    fixCSSConflicts();
    
    // 4. Ativar monitoramento
    const observer = monitorAndPreventChanges();
    
    // 5. Verificar se tudo foi aplicado
    setTimeout(() => {
      const status = verifyFixes();
      
      // Salvar status no localStorage
      if (status) {
        localStorage.setItem('css-fixes-status', JSON.stringify({
          ...status,
          appliedAt: new Date().toISOString()
        }));
      }
      
      console.log('='.repeat(50));
      console.log('🎉 APLICAÇÃO DE CORREÇÕES CONCLUÍDA!');
      
      // Mostrar resumo
      if (status) {
        console.log('📋 RESUMO:');
        console.log(`- CSS de correções: ${status.cssFixes ? '✅' : '❌'}`);
        console.log(`- Classes específicas aplicadas: ${Object.values(status.specificClasses).reduce((a, b) => a + b, 0)}`);
        console.log(`- Variáveis CSS: ${status.variables.foreground ? '✅' : '❌'}`);
      }
      
    }, 1000);
    
  } catch (error) {
    console.error('❌ ERRO AO APLICAR CORREÇÕES:', error);
  }
}

// Hook para usar em componentes React
export function useCSSFixes() {
  if (typeof window === 'undefined') return;
  
  // Aplicar correções quando o componente montar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
  } else {
    applyAllFixes();
  }
} 