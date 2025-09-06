# Configuração de Email

Este documento contém instruções detalhadas para configurar o envio de email tanto no ambiente de desenvolvimento local quanto no ambiente de produção (Vercel).

## Visão Geral

O sistema de envio de email utiliza o Nodemailer com o serviço do Gmail. Para funcionar corretamente, você precisa configurar duas variáveis de ambiente:

- `GMAIL_USER`: Seu endereço de email do Gmail
- `GMAIL_APP_PASSWORD`: Senha de aplicativo do Gmail (não é a senha normal da sua conta)

## Configuração Local

1. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
GMAIL_USER=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_aplicativo_do_gmail
```

2. Reinicie o servidor de desenvolvimento para aplicar as alterações.

## Configuração na Vercel (Produção)

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá para "Settings" > "Environment Variables"
4. Adicione as seguintes variáveis:
   - Nome: `GMAIL_USER`, Valor: `seu_email@gmail.com`
   - Nome: `GMAIL_APP_PASSWORD`, Valor: `sua_senha_de_aplicativo_do_gmail`
5. Clique em "Save" para salvar as alterações
6. Faça um novo deploy do projeto para aplicar as alterações

## Como Obter uma Senha de Aplicativo do Gmail

1. Acesse sua [Conta Google](https://myaccount.google.com/)
2. Vá para "Segurança"
3. Em "Como fazer login no Google", verifique se a "Verificação em duas etapas" está ativada
   - Se não estiver, ative-a seguindo as instruções
4. Depois de ativar a verificação em duas etapas, volte para a página de segurança
5. Procure por "Senhas de app" e clique nela
6. No menu suspenso "Selecionar app", escolha "Outro (nome personalizado)"
7. Digite um nome para identificar o aplicativo (ex: "Portfolio Website")
8. Clique em "Gerar"
9. O Google exibirá uma senha de 16 caracteres. Esta é sua senha de aplicativo.
10. Copie esta senha e use-a como valor para `GMAIL_APP_PASSWORD`

## Solução de Problemas

### Erro 500 ao Enviar Email

Se você estiver recebendo um erro 500 ao tentar enviar um email, verifique:

1. Se a variável `GMAIL_APP_PASSWORD` está configurada corretamente
2. Se você está usando uma senha de aplicativo válida (e não sua senha normal do Gmail)
3. Se a conta do Gmail tem a verificação em duas etapas ativada
4. Se o email de origem (`GMAIL_USER`) corresponde à conta onde você gerou a senha de aplicativo

### Erro no Ambiente de Produção (Vercel)

Se o envio de email funciona localmente mas falha na Vercel:

1. Verifique se as variáveis de ambiente estão configuradas corretamente no dashboard da Vercel
2. Faça um novo deploy após configurar as variáveis
3. Verifique os logs de execução na Vercel para identificar possíveis erros

## Referências

- [Documentação do Nodemailer](https://nodemailer.com/)
- [Senhas de aplicativo do Google](https://support.google.com/accounts/answer/185833)
- [Configuração de variáveis de ambiente na Vercel](https://vercel.com/docs/concepts/projects/environment-variables)