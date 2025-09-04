# Solução para Erro 404 na API do GitHub

## Problema

O erro `Error: Erro ao buscar repositórios estrelados (API interna): 404` ocorre quando o token de acesso pessoal do GitHub está expirado ou inválido.

## Solução

### 1. Gerar um novo token do GitHub

1. Acesse [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Dê um nome ao token (ex: "Portfolio Website")
4. Selecione os seguintes escopos:
   - `repo` (acesso completo aos repositórios)
   - `read:user` (para ler informações do usuário)
   - `user:email` (para acessar emails)
5. Clique em "Generate token"
6. **Importante**: Copie o token gerado, pois ele não será mostrado novamente

### 2. Atualizar o token no arquivo .env.local

Você pode atualizar o token manualmente editando o arquivo `.env.local` ou usar o script fornecido:

```bash
node scripts/update-github-token.js SEU_NOVO_TOKEN
```

### 3. Verificar o status do token

Após atualizar o token, você pode verificar se ele está funcionando corretamente acessando:

```
http://localhost:3000/api/github/token-status
```

Se o token estiver válido, você verá uma resposta como:

```json
{
  "status": "valid",
  "message": "Token válido",
  "username": "seu-usuario-github",
  "rate_limit": "4999"
}
```

### 4. Reiniciar o servidor

Após atualizar o token, reinicie o servidor de desenvolvimento para aplicar as alterações:

```bash
npm run dev
```

## Notas Importantes

- Os tokens pessoais do GitHub expiram após um período definido durante a criação
- Recomenda-se usar tokens com o menor escopo possível para segurança
- O formato de autorização foi atualizado para usar `Bearer` em vez de `token`
- Se o problema persistir, verifique os logs do servidor para mais detalhes