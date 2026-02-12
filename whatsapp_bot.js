const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Configurações da API do WhatsApp
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Verification failed');
  }
});

// Webhook para receber mensagens
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      const changes = entry.changes;
      changes?.forEach(change => {
        if (change.field === 'messages') {
          const messages = change.value.messages;
          if (messages) {
            messages.forEach(message => {
              processMessage(message);
            });
          }
        }
      });
    });

    res.status(200).send('OK');
  } else {
    res.status(404).send('Not Found');
  }
});

// Função para processar mensagens recebidas
function processMessage(message) {
  const from = message.from;
  const messageBody = message.text?.body?.toLowerCase();
  
  console.log(`Mensagem recebida de ${from}: ${messageBody}`);
  
  // Lógica de respostas automáticas
  let responseMessage = getAutoResponse(messageBody);
  
  if (responseMessage) {
    sendMessage(from, responseMessage);
  }
}

// Lógica de respostas automáticas
function getAutoResponse(messageBody) {
  if (!messageBody) return null;

  const responses = {
    'oi': 'Olá! Como posso ajudar você hoje?',
    'ola': 'Olá! Como posso ajudar você hoje?',
    'bom dia': 'Bom dia! Em que posso ajudá-lo?',
    'boa tarde': 'Boa tarde! Como posso auxiliá-lo?',
    'boa noite': 'Boa noite! Em que posso ser útil?',
    'ajuda': 'Estou aqui para ajudar! Digite:\n• "preços" - Ver preços\n• "horarios" - Ver horários\n• "contato" - Falar com humano',
    'precos': 'Nossos preços:\n• Serviço A - R$ 100\n• Serviço B - R$ 200\n• Serviço C - R$ 300',
    'horarios': 'Funcionamos:\n• Segunda a Sexta: 8h às 18h\n• Sábado: 8h às 12h\n• Domingo: Fechado',
    'contato': 'Um de nossos atendentes entrará em contato em breve. Obrigado!',
    'tchau': 'Até logo! Volte sempre que precisar.',
    'obrigado': 'De nada! Sempre à disposição.',
    'obrigada': 'De nada! Sempre à disposição.'
  };

  // Procura por palavras-chave
  for (const keyword in responses) {
    if (messageBody.includes(keyword)) {
      return responses[keyword];
    }
  }

  // Resposta padrão
  return 'Desculpe, não entendi. Digite "ajuda" para ver as opções disponíveis.';
}

// Função para enviar mensagens
async function sendMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: {
        body: message
      }
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(url, data, config);
    console.log('Mensagem enviada com sucesso:', response.data);
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Bot WhatsApp rodando na porta ${port}`);
  console.log(`Webhook URL: http://localhost:${port}/webhook`);
});