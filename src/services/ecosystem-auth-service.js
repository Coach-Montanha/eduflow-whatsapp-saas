// Ecosystem Auth Service for JS (whatsapp_lovable_app)

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'disposable.com',
  'temp-mail.org',
  'fakeinbox.com',
  'maildrop.cc',
  'nada.ltd',
  'crazymailing.com',
  'tmail.ws',
  'boun.cr',
  'disposablemail.com',
  'mailcatch.com',
  'inboxalias.com'
]);

/**
 * 1. validateEmailMx(email)
 * Syntax & MX validation
 */
export async function validateEmailMx(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'E-mail não fornecido.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    return { valid: false, reason: 'Formato de e-mail inválido.' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Formato de e-mail inválido.' };
  }

  const domain = parts[1];

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, reason: `O domínio "${domain}" é um serviço de e-mail descartável não permitido.` };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.Status === 3) {
        return { valid: false, reason: `O domínio "${domain}" não existe (servidor de e-mail não encontrado).` };
      }
      if (data.Status === 0 && (!data.Answer || data.Answer.length === 0)) {
        return { valid: false, reason: `O domínio "${domain}" não possui registros MX válidos para receber e-mails.` };
      }
    }
  } catch (err) {
    console.warn('[EcosystemAuth] DNS MX lookup bypassed:', err);
  }

  return { valid: true };
}

/**
 * 2. checkAndLockGuestDemo(email)
 * Check guest lockout table
 */
export async function checkAndLockGuestDemo(email) {
  const cleanEmail = email.trim().toLowerCase();
  const localLockedKey = `ecosystem_guest_lockout_${cleanEmail}`;

  if (localStorage.getItem(localLockedKey)) {
    return {
      allowed: false,
      locked: true,
      message: 'Este e-mail já utilizou a demonstração gratuita no ecossistema Montanha. Por favor, faça login ou cadastre-se para continuar.'
    };
  }

  localStorage.setItem(localLockedKey, 'true');

  return {
    allowed: true,
    locked: false,
    message: 'Acesso ao modo demonstração liberado. Seu e-mail foi registrado no ecossistema.'
  };
}

/**
 * Helper to generate and send OTP
 */
export async function sendOtpToken(email) {
  const cleanEmail = email.trim().toLowerCase();
  const mxResult = await validateEmailMx(cleanEmail);

  if (!mxResult.valid) {
    return { success: false, message: mxResult.reason || 'E-mail inválido.' };
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  localStorage.setItem(`ecosystem_latest_otp_${cleanEmail}`, JSON.stringify({ token, expiresAt }));

  return {
    success: true,
    token: token,
    message: `Código OTP de 6 dígitos enviado para ${cleanEmail}. (Código para testes: ${token})`
  };
}

/**
 * 3. verifyOtpToken(email, token)
 * OTP Verification (6 digits)
 */
export async function verifyOtpToken(email, token) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = (token || '').trim();

  if (!cleanToken || cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) {
    return { success: false, message: 'O código OTP deve possuir exatamente 6 dígitos numéricos.' };
  }

  let verified = false;
  const raw = localStorage.getItem(`ecosystem_latest_otp_${cleanEmail}`);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.token === cleanToken && new Date(parsed.expiresAt) > new Date()) {
        verified = true;
      }
    } catch (err) {}
  }

  if (!verified) {
    return { success: false, message: 'Código OTP incorreto, expirado ou já utilizado.' };
  }

  return {
    success: true,
    message: 'E-mail verificado com sucesso via código OTP!',
    user: { id: `usr_${Date.now()}`, email: cleanEmail, role: 'user' }
  };
}

/**
 * 4. checkProjectAccess(userId, projectId, email)
 * Project Access check
 */
export async function checkProjectAccess(userId, projectId, email) {
  const cleanEmail = email ? email.trim().toLowerCase() : null;
  const localSub = localStorage.getItem(`ecosystem_sub_${projectId}_${cleanEmail || userId}`);

  if (localSub) {
    try {
      const parsed = JSON.parse(localSub);
      const isExpired = parsed.access_expires_at ? new Date(parsed.access_expires_at) <= new Date() : false;
      if (parsed.payment_status === 'PAGO' && !isExpired && parsed.is_active !== false) {
        return {
          hasAccess: true,
          status: 'PAGO',
          expiresAt: parsed.access_expires_at,
          message: 'Acesso liberado.'
        };
      }
    } catch (err) {}
  }

  return {
    hasAccess: true,
    status: 'DEMO',
    expiresAt: null,
    message: 'Acesso liberado em modo demonstração.'
  };
}

const APP_NAMES_MAP = {
  'smart-language': { name: 'Montanha Language AI', url: 'http://localhost:5173' },
  'eduflow-finance': { name: 'Montanha Personal Studio', url: 'http://localhost:5174' },
  'construtor-pdf': { name: 'Montanha PDF Studio', url: 'http://localhost:5175' },
  'sistema-hibrido': { name: 'Montanha Hybrid Training', url: 'http://localhost:5176' },
  'whatsapp-lovable': { name: 'Montanha WhatsApp Automation', url: 'http://localhost:5177' },
  'all': { name: 'Ecossistema Montanha (5 Apps)', url: 'http://localhost:5177' }
};

export function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'MTN-' + code;
}

export async function generateTempAccessInvite(clientName, email, phone, projectId, durationDays) {
  const tempPassword = generateTempPassword();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').replace(/\D/g, '');

  let expiresAt = null;
  let validityLabel = '';

  if (durationDays === 'vitalicio') {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 10);
    expiresAt = d.toISOString();
    validityLabel = 'Vitalício (Sem Expiração)';
  } else {
    const days = Number(durationDays) || 30;
    const d = new Date(Date.now() + days * 24 * 3600 * 1000);
    expiresAt = d.toISOString();
    validityLabel = days + ' dias';
  }

  const appInfo = APP_NAMES_MAP[projectId] || { name: projectId, url: typeof window !== 'undefined' ? window.location.origin : '' };
  const expiresFormatted = expiresAt ? expiresAt.split('T')[0] : 'Indefinido';

  const inviteText = `Olá, ${clientName}! 🎟️\n\nSeu acesso ao *${appInfo.name}* (Ecossistema Montanha) foi gerado com sucesso!\n\n🔑 *Login:* ${cleanEmail}\n🔒 *Senha Temporária:* ${tempPassword}\n⏳ *Validade:* ${validityLabel} (Até ${expiresFormatted})\n🌐 *Link de Acesso:* ${appInfo.url}\n\nBons treinos e excelentes resultados! 🚀`;

  const phoneParam = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
  const whatsappUrl = `https://wa.me/${phoneParam}?text=${encodeURIComponent(inviteText)}`;

  const projectsToGrant = projectId === 'all'
    ? ['smart-language', 'eduflow-finance', 'construtor-pdf', 'sistema-hibrido', 'whatsapp-lovable']
    : [projectId];

  const updatedSubs = [];

  for (const pid of projectsToGrant) {
    const sub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      project_id: pid,
      payment_status: 'PAGO',
      access_expires_at: expiresAt,
      is_active: true,
      created_at: new Date().toISOString()
    };
    updatedSubs.push(sub);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ecosystem_sub_${pid}_${cleanEmail}`, JSON.stringify(sub));
    }
  }

  if (typeof window !== 'undefined') {
    const existingRaw = localStorage.getItem('master_admin_subscriptions');
    let existing = [];
    if (existingRaw) {
      try { existing = JSON.parse(existingRaw); } catch (e) {}
    }
    const combined = [...updatedSubs, ...existing];
    localStorage.setItem('master_admin_subscriptions', JSON.stringify(combined));
  }

  return {
    success: true,
    tempPassword,
    expiresAt,
    validityLabel,
    whatsappUrl,
    inviteText,
    message: 'Convite e senha temporária gerados com sucesso!'
  };
}

if (typeof window !== 'undefined') {
  window.EcosystemAuthService = {
    validateEmailMx,
    checkAndLockGuestDemo,
    sendOtpToken,
    verifyOtpToken,
    checkProjectAccess,
    generateTempPassword,
    generateTempAccessInvite
  };
}

