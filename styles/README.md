# 🎨 Organização do CSS

Esta pasta contém os arquivos CSS organizados por responsabilidade para melhor manutenção e escalabilidade.

## 📁 Estrutura de Arquivos

```
styles/
├── README.md                 # Este arquivo
├── variables.css            # Variáveis CSS organizadas por categoria
├── utilities.css            # Classes utilitárias customizadas
├── components.css           # Classes específicas de componentes
├── animations.css           # Animações e keyframes
└── design-tokens.css        # Tokens de design reutilizáveis
```

## 🎯 Responsabilidades

### `variables.css`
- Variáveis CSS organizadas por categoria (cores, espaçamentos, etc.)
- Configurações de tema claro/escuro
- Variáveis de design system

### `utilities.css`
- Classes utilitárias customizadas
- Extensões do Tailwind CSS
- Classes de layout e espaçamento

### `components.css`
- Classes específicas de componentes
- Padrões reutilizáveis (glassmorphic, gradients, etc.)
- Classes de botões e cards

### `animations.css`
- Keyframes e animações
- Classes de animação customizadas
- Transições específicas

### `design-tokens.css`
- Tokens de design reutilizáveis
- Classes base para componentes
- Padrões de design system

## 🔄 Migração

Para migrar do `app/globals.css` atual:

1. **Extrair variáveis** → `variables.css`
2. **Extrair utilitários** → `utilities.css`
3. **Extrair componentes** → `components.css`
4. **Extrair animações** → `animations.css`
5. **Criar tokens** → `design-tokens.css`
6. **Importar todos** no `app/globals.css`

## 📋 Benefícios

- ✅ **Melhor organização** por responsabilidade
- ✅ **Facilita manutenção** e debugging
- ✅ **Reutilização** de padrões
- ✅ **Escalabilidade** para novos componentes
- ✅ **Documentação** clara das classes
- ✅ **Separação** de concerns

## 🚀 Próximos Passos

1. Implementar a nova estrutura
2. Migrar classes existentes
3. Documentar todas as classes
4. Criar padrões reutilizáveis
5. Testar em todos os componentes 