const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

// 🌟 FIREBASE URL (Optional for logging inquiries or dynamic data)
const FIREBASE_URL = process.env.FIREBASE_URL;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_data');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ["Codestra", "Tech", "1"] 
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.clear(); 
            console.log('\n==================================================');
            console.log('Codestra Technology Bot - Scan QR to Start');
            console.log('==================================================\n');
            qrcode.generate(qr, { small: true }); 
        }

        if (connection === 'open') console.log('✅ CODESTRA TECHNOLOGY AI IS ONLINE!');
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startBot();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;
        if (msg.key.fromMe) return; 

        const sender = msg.key.remoteJid;
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase();

        console.log(`📩 Inquiry from ${sender}: ${text}`);

        // --- GREETINGS ---
        if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("start")) {
            const welcome = `👋 *Welcome to Codestra Technology!* 🚀\n\nI am your AI Assistant. We provide modern secure websites and 24-hour service to help your business grow.\n\n*How can I help you today?*\n\n1️⃣  *Web Development*\n2️⃣  *Software Systems*\n3️⃣  *Mobile Apps*\n4️⃣  *Pricing*\n5️⃣  *Graphics & Video*\n6️⃣  *About Us*\n7️⃣  *Contact Admin*\n\n_Type a keyword (e.g., 'Web' or 'Pricing') to see details!_`;
            await sock.sendMessage(sender, { text: welcome });
        }

        // --- 1. WEB PAGES ---
        else if (text.includes("web") || text.includes("site") || text.includes("page")) {
            const webMsg = `🌐 *Web Development Services*\n\nWe create high-quality websites for:\n✅ Business Web\n✅ Hotel Sites\n✅ Tourism Sites\n✅ Shopping Sites (E-commerce)\n✅ Education Systems\n\n_Type *Pricing* to see our rates!_`;
            await sock.sendMessage(sender, { text: webMsg });
        }

        // --- 2. SYSTEMS ---
        else if (text.includes("system")) {
            const sysMsg = `💻 *Enterprise Software Systems*\n\nAutomate your business with our custom systems:\n🔹 LMS System (Learning Management)\n🔹 POS System (Point of Sale)\n🔹 QR Attendance System\n🔹 Custom QR Systems`;
            await sock.sendMessage(sender, { text: sysMsg });
        }

        // --- 3. MOBILE APPS ---
        else if (text.includes("mobile") || text.includes("app")) {
            const appMsg = `📱 *Mobile App & Web Development*\n\nWe build cross-platform solutions including:\n- Business Web/Apps\n- Hotel & Tourism Solutions\n- Shopping & E-commerce Apps\n- Education & LMS Apps\n- POS & QR Attendance Integrations`;
            await sock.sendMessage(sender, { text: appMsg });
        }

        // --- 4. CONTACT ---
        else if (text.includes("contact") || text.includes("call") || text.includes("number") || text.includes("admin")) {
            const contactMsg = `📞 *Contact Codestra Technology Admin*\n\n- *Call:* 0756667333\n- *WhatsApp:* 0743186648\n\nWe are available 24/7 to assist you!`;
            await sock.sendMessage(sender, { text: contactMsg });
        }

        // --- 5. ABOUT US ---
        else if (text.includes("about") || text.includes("info")) {
            const aboutMsg = `🏢 *About Codestra Technology*\n\nYou can get good and modern secure websites and twenty-four hour service from us. We prioritize security and performance in every project.\n\n*Thank you and congratulations to you for working with us!*`;
            await sock.sendMessage(sender, { text: aboutMsg });
        }

        // --- 6. PRICING ---
        else if (text.includes("price") || text.includes("pricing") || text.includes("cost")) {
            const pricingMsg = `💰 *Codestra Pricing List* (Sri Lanka)\n\n🌎 *Standard Website*\nRs. 10,000.00\n\n🎓 *LMS System*\nRs. 30,000.00\n\n🛒 *POS System*\nRs. 20,000.00\n\n📱 *QR Code System*\nRs. 25,000.00\n\n⚠️ _Note: Prices are for development only. Domain and Hosting are not included._`;
            await sock.sendMessage(sender, { text: pricingMsg });
        }

        // --- 7. GRAPHICS & VIDEO ---
        else if (text.includes("graphic") || text.includes("design") || text.includes("video")) {
            const designMsg = `🎨 *Graphics & Video Designing*\n\n✨ Logo Designing\n✨ Post Designing\n✨ Anime Video Designing\n✨ Banner Designing\n✨ File Designing\n✨ Tube Cover Designing\n✨ AI Advertisement Designing`;
            await sock.sendMessage(sender, { text: designMsg });
        }

        // --- DEFAULT ---
        else {
            await sock.sendMessage(sender, { text: "🤔 I didn't quite catch that. \n\nType *Web*, *System*, *Pricing*, or *Contact* to get started with **Codestra Technology**!" });
        }
    });
}

startBot().catch(err => console.log("Critical Error: " + err));