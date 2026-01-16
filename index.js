const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configuração do cliente com LocalAuth para salvar a sessão
// e argumentos específicos para rodar em hospedagens (Puppeteer)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--shm-size=3gb'
        ],
    }
});

const delay = ms => new Promise(res => setTimeout(res, ms));

// Exibe o QR Code no terminal/log
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('Escaneie o QR Code acima para conectar.');
});

// Confirmação de conexão
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Lógica das mensagens (Funil)
client.on('message', async msg => {
    // Filtro para aceitar apenas mensagens de pessoas (evita grupos)
    if (!msg.from.endsWith('@c.us')) return;

    const chat = await msg.getChat();
    const body = msg.body;

    // MENU PRINCIPAL
    if (body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i)) {
        await delay(2000);
        await chat.sendStateTyping();
        const contact = await msg.getContact();
        const name = contact.pushname || "cliente";
        
        await client.sendMessage(msg.from, `Olá! ${name.split(" ")[0]}! Sou o assistente virtual da empresa *UNITV*.\n\nPor favor, ‼️digite‼️ uma das opções abaixo:\n\n1️⃣ - Como funciona\n2️⃣ - Valores dos planos\n3️⃣ - Benefícios\n4️⃣ - Como aderir\n5️⃣ - Outras perguntas`);
    }

    // OPÇÃO 1 - COMO FUNCIONA
    if (body === '1') {
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, 'Nosso serviço oferece *suporte 24 horas* por dia diretamente pelo WhatsApp.\n\nO app *UniTV* permite assistir canais ao vivo, séries e filmes pelo celular ou TV Box.');
        await delay(2000);
        await client.sendMessage(msg.from, '1️⃣º Faça seu cadastro.\n2️⃣º Efetue o pagamento.\n3️⃣º Baixe o app no seu dispositivo.');
        await delay(2000);
        await client.sendMessage(msg.from, 'Links para download:\n\n✅ TV BOX/CELULAR: https://app.unitv9.com/app/unitviptvmobile_UN-MOAP-1.apk\n\n✅ SMARTV: https://app.unitv9.com/app/unitv_UN-TVAK-1.apk');
    }

    // OPÇÃO 2 - VALORES
    if (body === '2') {
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, '*Plano Individual:* R$22,50/mês.\n*Plano Família:* R$34,90/mês (3 telas).\n*Plano TOP Individual:* R$42,50/mês.\n*Plano TOP Família:* R$79,90/mês (5 telas).');
        await delay(2000);
        await client.sendMessage(msg.from, 'Pagamento via PIX:\n*unitvvr@hotmail.com*\n\nEnvie o comprovante após o pagamento.');
    }

    // OPÇÃO 3 - BENEFÍCIOS
    if (body === '3') {
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, '🎁 *Promoção:* Convide 2 amigos e ganhe 1 mês grátis!\n\nSão mais de 97 mil conteúdos disponíveis.');
    }

    // OPÇÃO 4 - ADERIR
    if (body === '4') {
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, 'Entraremos em contato com você em alguns instantes para finalizar sua adesão! 😊');
    }

    // OPÇÃO 5 - OUTRAS DÚVIDAS
    if (body === '5') {
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, 'Pode digitar sua dúvida aqui, em breve um atendente humano irá te responder.');
    }
});

client.initialize();