# WhatsApp Bot

Bot automatizado para WhatsApp usando a Meta Business API.

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- Conta WhatsApp Business
- App configurado no Meta for Developers

## 🚀 Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Edite o arquivo `.env` com suas credenciais:
```
WHATSAPP_TOKEN=EAAv76bDZBlnc...
WHATSAPP_PHONE_NUMBER_ID=103418217310163
WHATSAPP_BUSINESS_ACCOUNT_ID=894603540137440
VERIFY_TOKEN=meu_token_secreto
PORT=3000
```

### 3. Configurar webhook no Meta for Developers
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Vá em seu app > WhatsApp > Configuração
3. Configure o webhook:
   - **URL do webhook**: `https://seu-dominio.com/webhook`
   - **Token de verificação**: o mesmo valor do `VERIFY_TOKEN` no .env
   - **Campos**: marque `messages`

## 🔧 Como usar

### Executar o bot
```bash
# Produção
npm start

# Desenvolvimento (com auto-reload)
npm run dev
```

### Testar localmente
Para testar localmente, use [ngrok](https://ngrok.com/):
```bash
# Instalar ngrok
npm install -g ngrok

# Executar o bot
npm start

# Em outro terminal, expor para internet
ngrok http 3000
```

Use a URL do ngrok como webhook URL no Meta for Developers.

## 🤖 Comandos disponíveis

O bot responde aos seguintes comandos:

- **oi/olá** - Saudação inicial
- **ajuda** - Mostra menu de opções
- **preços** - Lista de preços dos serviços
- **horários** - Horários de funcionamento
- **contato** - Solicita contato humano
- **obrigado** - Agradecimento

## 📝 Personalização

### Adicionar novas respostas
Edite a função `getAutoResponse()` no arquivo `whatsapp_bot.js`:

```javascript
const responses = {
  'nova_palavra': 'Nova resposta aqui',
  // ...
};
```

### Adicionar funcionalidades avançadas
- Integração com banco de dados
- Processamento de imagens/documentos
- Menu interativo com botões
- Templates de mensagem
- Integrações com APIs externas

## 📊 Monitoramento

### Logs
O bot exibe logs no console para:
- Mensagens recebidas
- Mensagens enviadas
- Erros de API

### Health Check
Acesse `http://localhost:3000/health` para verificar se o serviço está funcionando.

## ⚠️ Importante

1. **Mantenha seu token seguro** - Nunca compartilhe o `WHATSAPP_TOKEN`
2. **Rate limits** - A API tem limites de mensagens por minuto
3. **Webhook SSL** - Em produção, use HTTPS obrigatoriamente
4. **Backup** - Faça backup das configurações regularmente

## 🆘 Troubleshooting

### Webhook não funciona
- Verifique se a URL está acessível externamente
- Confirme se o `VERIFY_TOKEN` está correto
- Veja os logs do console para erros

### Mensagens não são enviadas
- Verifique se o `WHATSAPP_TOKEN` está válido
- Confirme se o `PHONE_NUMBER_ID` está correto
- Veja se há erros de rate limit nos logs

### Bot não responde
- Verifique se o webhook está configurado corretamente
- Confirme se os campos 'messages' estão marcados
- Teste enviando uma mensagem e observe os logs