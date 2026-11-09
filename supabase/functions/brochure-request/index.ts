// Rahim International — demandes de brochure du site (enregistrement, envoi par Brevo, contact Brevo)
// et demandes de préconsultation par téléphone faites juste après ;
// rappel du questionnaire envoyé à la main depuis l'espace de gestion (action 'reminder', admins seulement) ;
// pré-remplissage du questionnaire (action 'prefill') et e-mail de confirmation après le questionnaire (action 'questionnaire')
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BREVO = Deno.env.get('BREVO_API_KEY');
const LIST_BROCHURE = Number(Deno.env.get('BREVO_LIST_BROCHURE') ?? 0);
const LIST_NEWSLETTER = Number(Deno.env.get('BREVO_LIST_NEWSLETTER') ?? 0);
const SENDER = { name: 'Rahim International', email: Deno.env.get('MAIL_FROM_EMAIL') ?? 'contact@rahiminternational.com' };
const REPLY_TO = { email: 'contact@rahiminternational.com', name: 'Rahim International' };
const SITE = 'https://rahiminternational.com';
const WHATSAPP = 'https://wa.me/212642773249';
const LINK_DAYS = 30;
const ORIGINS = ['https://rahiminternational.com', 'https://www.rahiminternational.com'];

const PROFILES = ['mre', 'resident', 'international', 'seller'] as const;
const TIMEFRAMES = ['lt3m', '3to12m', 'gt12m', 'info'];
const LANGS = ['fr', 'en', 'ar'];
const CHANNELS = ['phone', 'whatsapp'];
const SLOTS = ['morning', 'afternoon', 'evening', 'any'];

const T: Record<string, Record<string, string>> = {
  fr: {
    subject: 'Votre brochure Rahim International',
    title: 'Votre brochure est prête',
    hello: 'Bonjour',
    intro: 'Merci de l’intérêt que vous portez à Rahim International. Vous trouverez ci-dessous votre brochure, qui présente notre accompagnement, nos formules et nos honoraires.',
    intro_seller: 'Merci de l’intérêt que vous portez à Rahim International. Vous trouverez ci-dessous notre brochure destinée aux propriétaires et aux promoteurs, qui présente notre accompagnement et nos conditions.',
    download: 'Télécharger la brochure',
    validity: `Le lien de téléchargement reste valable ${LINK_DAYS} jours.`,
    next: 'Lorsque vous serez prêt à avancer, le questionnaire de préconsultation nous permet de préparer votre plan préliminaire. Il ne prend que 5 à 10 minutes. Vous préférez le faire par téléphone ? Répondez simplement à cet e-mail ou écrivez-nous sur WhatsApp, et nous vous appellerons.',
    next_cta: 'Remplir le questionnaire',
    next_seller: 'Pour parler de votre bien, vous pouvez nous écrire directement sur WhatsApp ou répondre à cet e-mail.',
    next_seller_cta: 'Nous écrire sur WhatsApp',
    pending_subject: 'Votre demande de brochure Rahim International',
    pending_title: 'Nous avons bien reçu votre demande',
    pending: 'Merci de l’intérêt que vous portez à Rahim International. Votre brochure vous sera envoyée par e-mail dans les prochaines heures.',
    call_subject: 'Votre préconsultation par téléphone',
    call_title: 'Nous vous appellerons',
    call_text: 'Merci. Nous vous contacterons {channel} au {phone} pour faire le point sur votre projet, de préférence {slot} (heure de votre pays). Cet échange remplace le questionnaire en ligne : vous n’avez rien d’autre à préparer.',
    ch_phone: 'par téléphone', ch_whatsapp: 'sur WhatsApp',
    sl_morning: 'le matin', sl_afternoon: 'l’après-midi', sl_evening: 'en soirée', sl_any: 'au moment qui vous convient',
    reminder_subject: 'Votre projet immobilier au Maroc',
    reminder_title: 'Où en est votre projet ?',
    reminder: 'Il y a quelques jours, vous avez reçu notre brochure. Si votre projet avance, le questionnaire de préconsultation nous permet de préparer votre plan préliminaire et votre consultation gratuite. Il ne prend que 5 à 10 minutes.',
    reminder_after: 'Vous préférez en parler par téléphone, ou vous avez une question sur nos formules ? Répondez simplement à cet e-mail ou écrivez-nous sur WhatsApp.',
    q_subject: 'Nous avons bien reçu vos réponses',
    q_title: 'Nous préparons votre plan',
    q_text: 'Merci d’avoir rempli notre questionnaire de préconsultation. Nous préparons maintenant votre Plan d’Acquisition Personnalisé préliminaire, sous 72 heures. Nous vous contacterons ensuite pour fixer la date de votre consultation gratuite, où nous le passerons en revue ensemble.',
    q_brochure: 'En attendant, vous trouverez ci-dessous notre brochure, qui présente notre accompagnement, nos formules et nos honoraires.',
    q_brochure_later: 'Notre brochure, qui présente nos formules et nos honoraires, vous sera envoyée par e-mail séparément.',
    q_after: 'Une question d’ici là ? Répondez simplement à cet e-mail ou écrivez-nous sur WhatsApp.',
    q_pro_title: 'Nous avons bien reçu votre demande',
    q_pro: 'Merci d’avoir rempli notre questionnaire. Votre projet demande une étude sur mesure : nous vous rappelons sous 24 heures pour en parler, puis nous vous présentons des options adaptées et un devis pour notre accompagnement.',
    sign: 'L’équipe de Rahim International',
  },
  en: {
    subject: 'Your Rahim International brochure',
    title: 'Your brochure is ready',
    hello: 'Hello',
    intro: 'Thank you for your interest in Rahim International. Below you will find your brochure, which presents our support, our service packages and our fees.',
    intro_seller: 'Thank you for your interest in Rahim International. Below you will find our brochure for property owners and developers, which presents our support and our terms.',
    download: 'Download the brochure',
    validity: `The download link remains valid for ${LINK_DAYS} days.`,
    next: 'When you are ready to move forward, the pre-consultation questionnaire allows us to prepare your preliminary plan. It takes only 5 to 10 minutes. Would you rather do it by phone? Simply reply to this email or write to us on WhatsApp, and we will call you.',
    next_cta: 'Fill in the questionnaire',
    next_seller: 'To discuss your property, you can write to us directly on WhatsApp or reply to this email.',
    next_seller_cta: 'Write to us on WhatsApp',
    pending_subject: 'Your Rahim International brochure request',
    pending_title: 'We have received your request',
    pending: 'Thank you for your interest in Rahim International. Your brochure will be sent to you by email within the next few hours.',
    call_subject: 'Your pre-consultation by phone',
    call_title: 'We will call you',
    call_text: 'Thank you. We will contact you {channel} on {phone} to discuss your project, preferably {slot} (your local time). This call replaces the online questionnaire, so there is nothing else to prepare.',
    ch_phone: 'by phone', ch_whatsapp: 'on WhatsApp',
    sl_morning: 'in the morning', sl_afternoon: 'in the afternoon', sl_evening: 'in the evening', sl_any: 'at a time that suits you',
    reminder_subject: 'Your property project in Morocco',
    reminder_title: 'How is your project going?',
    reminder: 'A few days ago, you received our brochure. If your project is moving forward, the pre-consultation questionnaire allows us to prepare your preliminary plan and your free consultation. It takes only 5 to 10 minutes.',
    reminder_after: 'Would you rather talk by phone, or do you have a question about our service packages? Simply reply to this email or write to us on WhatsApp.',
    q_subject: 'We have received your answers',
    q_title: 'We are preparing your plan',
    q_text: 'Thank you for completing our pre-consultation questionnaire. We are now preparing your preliminary Strategic Acquisition Plan, within 72 hours. We will then contact you to set the date of your free consultation, where we will go through it together.',
    q_brochure: 'In the meantime, you will find our brochure below, which presents our support, our service packages and our fees.',
    q_brochure_later: 'Our brochure, which presents our service packages and fees, will be sent to you separately by email.',
    q_after: 'Any questions in the meantime? Simply reply to this email or write to us on WhatsApp.',
    q_pro_title: 'We have received your request',
    q_pro: 'Thank you for completing our questionnaire. Your project needs a tailored study: we will call you back within 24 hours to discuss it, then present suitable options and a quote for our services.',
    sign: 'The Rahim International team',
  },
  ar: {
    subject: 'كتيّب رحيم إنترناشيونال',
    title: 'كتيّبك جاهز',
    hello: 'مرحباً',
    intro: 'شكراً على اهتمامك برحيم إنترناشيونال. تجد أسفله كتيّبك، الذي يعرض مرافقتنا وباقاتنا وأتعابنا.',
    intro_seller: 'شكراً على اهتمامك برحيم إنترناشيونال. تجد أسفله كتيّبنا الموجّه إلى المالكين والمنعشين العقاريين، الذي يعرض مرافقتنا وشروطنا.',
    download: 'تحميل الكتيّب',
    validity: `يبقى رابط التحميل صالحاً لمدة ${LINK_DAYS} يوماً.`,
    next: 'حين تكون مستعداً للمضي قدماً، يتيح لنا استبيان ما قبل الاستشارة إعداد خطتك الأولية. لا يستغرق سوى 5 إلى 10 دقائق. تفضّل القيام بذلك عبر الهاتف؟ يكفي أن ترد على هذه الرسالة أو تراسلنا عبر واتساب، وسنتصل بك.',
    next_cta: 'ملء الاستبيان',
    next_seller: 'للحديث عن عقارك، يمكنك مراسلتنا مباشرة عبر واتساب أو الرد على هذه الرسالة.',
    next_seller_cta: 'راسلنا عبر واتساب',
    pending_subject: 'طلبك لكتيّب رحيم إنترناشيونال',
    pending_title: 'توصّلنا بطلبك',
    pending: 'شكراً على اهتمامك برحيم إنترناشيونال. سيُرسل إليك الكتيّب عبر البريد الإلكتروني خلال الساعات القادمة.',
    call_subject: 'ما قبل الاستشارة عبر الهاتف',
    call_title: 'سنتصل بك',
    call_text: 'شكراً. سنتواصل معك {channel} على الرقم {phone} للحديث عن مشروعك، ويُفضَّل {slot} (بتوقيت بلدك). يعوّض هذا الاتصال الاستبيان الإلكتروني، فلا شيء آخر عليك تحضيره.',
    ch_phone: 'عبر الهاتف', ch_whatsapp: 'عبر واتساب',
    sl_morning: 'صباحاً', sl_afternoon: 'بعد الظهر', sl_evening: 'مساءً', sl_any: 'في الوقت الذي يناسبك',
    reminder_subject: 'مشروعك العقاري في المغرب',
    reminder_title: 'أين وصل مشروعك؟',
    reminder: 'توصّلت قبل بضعة أيام بكتيّبنا. إن كان مشروعك يتقدّم، يتيح لنا استبيان ما قبل الاستشارة إعداد خطتك الأولية واستشارتك المجانية. لا يستغرق سوى 5 إلى 10 دقائق.',
    reminder_after: 'تفضّل الحديث عبر الهاتف، أو لديك سؤال عن باقاتنا؟ يكفي أن ترد على هذه الرسالة أو تراسلنا عبر واتساب.',
    q_subject: 'توصّلنا بإجاباتك',
    q_title: 'نُعدّ خطتك',
    q_text: 'شكراً على ملء استبيان ما قبل الاستشارة. نُعدّ الآن خطة الاقتناء الاستراتيجية الأولية الخاصة بك، خلال 72 ساعة. ثم نتواصل معك لتحديد موعد استشارتك المجانية، حيث نراجعها معاً.',
    q_brochure: 'في انتظار ذلك، تجد أسفله كتيّبنا، الذي يعرض مرافقتنا وباقاتنا وأتعابنا.',
    q_brochure_later: 'سيُرسل إليك كتيّبنا، الذي يعرض باقاتنا وأتعابنا، عبر البريد الإلكتروني بشكل منفصل.',
    q_after: 'لديك سؤال في انتظار ذلك؟ يكفي أن ترد على هذه الرسالة أو تراسلنا عبر واتساب.',
    q_pro_title: 'توصّلنا بطلبك',
    q_pro: 'شكراً على ملء الاستبيان. يتطلب مشروعك دراسة خاصة: سنتصل بك خلال 24 ساعة للحديث عنه، ثم نعرض عليك خيارات مناسبة وعرض أسعار لمرافقتنا.',
    sign: 'فريق رحيم إنترناشيونال',
  },
};
const tr = (lang: string) => T[lang] ?? T.fr;

function cors(req: Request) {
  const o = req.headers.get('origin') ?? '';
  const local = o.startsWith('http://localhost') || o.startsWith('http://127.0.0.1');
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(o) || local ? o : ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const clean = (s: unknown, max = 120) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const list = (v: unknown, max = 8) => (Array.isArray(v) ? v : []).map((x) => clean(x, 60)).filter(Boolean).slice(0, max);

function button(label: string, url: string, primary: boolean) {
  const bg = primary ? '#C9A96E' : '#ffffff';
  const border = primary ? '#C9A96E' : '#081a33';
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px"><tr><td style="background:${bg};border:1px solid ${border};border-radius:999px"><a href="${url}" style="display:inline-block;padding:13px 26px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#07111f;text-decoration:none;font-weight:bold">${esc(label)}</a></td></tr></table>`;
}

function layout(lang: string, title: string, body: string) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return `<!doctype html><html lang="${lang}" dir="${dir}"><body style="margin:0;background:#f4f7f8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e1e7ec">
<tr><td style="background:#07111f;padding:20px 28px"><span style="font-family:Georgia,serif;font-size:20px;letter-spacing:2px;color:#C9A96E">RAHIM</span> <span style="font-family:Georgia,serif;font-size:20px;letter-spacing:2px;color:#ffffff">INTERNATIONAL</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 14px;font-family:Georgia,serif;font-weight:normal;font-size:24px;color:#081a33">${esc(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e6edf1;font-size:12px;line-height:1.5;color:#657384">${esc(tr(lang).sign)}<br>WhatsApp : +212 6 42 77 32 49 · <a href="${SITE}" style="color:#081a33">rahiminternational.com</a></td></tr>
</table></td></tr></table></body></html>`;
}
// la référence (id de la demande de brochure) permet au questionnaire de pré-remplir le prénom et l'e-mail
const questionnaireUrl = (lang: string, profile: string, ref: string) => `${SITE}/${lang === 'en' ? '' : lang + '/'}consultation.html?profil=${profile}&ref=${ref}`;
const para = (html: string) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#33404f">${html}</p>`;

async function brevo(path: string, body?: unknown) {
  const r = await fetch('https://api.brevo.com/v3' + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'api-key': BREVO!, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!r.ok && r.status !== 204) throw new Error('Brevo ' + path + ' ' + r.status + ' ' + (await r.text()).slice(0, 300));
  return r.status === 204 ? null : r.json().catch(() => null);
}

// crée dans Brevo les attributs de contact qui manquent, une fois par démarrage de la fonction,
// et renvoie le nom de l'attribut du prénom (PRENOM sur un compte français, FIRSTNAME sinon)
const ATTRS = ['PROFIL', 'DELAI', 'VILLES', 'TYPE_BIEN', 'TELEPHONE', 'LANGUE', 'SUITE'];
let attrsReady: Promise<string> | null = null;
function ensureAttributes() {
  attrsReady ??= (async () => {
    const res = await brevo('/contacts/attributes');
    const names = new Set<string>((res?.attributes ?? []).map((a: { name: string }) => a.name));
    for (const n of ATTRS.filter((n) => !names.has(n))) await brevo(`/contacts/attributes/normal/${n}`, { type: 'text' });
    return names.has('PRENOM') || !names.has('FIRSTNAME') ? 'PRENOM' : 'FIRSTNAME';
  })().catch((e) => { attrsReady = null; throw e; });
  return attrsReady;
}

// alerte à l'équipe (adresses de la table admins)
async function alertTeam(admin: SupabaseClient, subject: string, title: string, rows: string[][]) {
  const { data: admins } = await admin.from('admins').select('email');
  const to = (admins ?? []).map((a) => ({ email: a.email }));
  if (!to.length) return;
  const lines = rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#657384;font-size:14px">${esc(k)}</td><td style="padding:6px 0;font-size:14px;color:#081a33">${esc(v)}</td></tr>`).join('');
  await brevo('/smtp/email', { sender: SENDER, to, subject, htmlContent: layout('fr', title, `<table role="presentation" cellpadding="0" cellspacing="0">${lines}</table>`) });
}

// le visiteur qui vient de demander la brochure préfère une préconsultation par téléphone
async function requestCall(admin: SupabaseClient, b: Record<string, unknown>, out: (s: number, body: unknown) => Response) {
  const id = clean(b.id, 40);
  const phone = clean(b.phone, 30);
  const channel = CHANNELS.includes(String(b.channel)) ? String(b.channel) : 'phone';
  const slot = SLOTS.includes(String(b.slot)) ? String(b.slot) : 'any';
  const tz = clean(b.timezone, 60) || null;
  if (!/^[0-9a-f-]{36}$/.test(id) || (phone.match(/\d/g) ?? []).length < 6) return out(400, { error: 'invalid' });

  const since = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
  const { data: r } = await admin.from('brochure_requests').select('*').eq('id', id).gte('created_at', since).maybeSingle();
  if (!r) return out(404, { error: 'request' });
  await admin.from('brochure_requests').update({
    call_requested_at: new Date().toISOString(), call_phone: phone, call_channel: channel, call_slot: slot, call_timezone: tz,
    whatsapp: r.whatsapp ?? (channel === 'whatsapp' ? phone : null),
  }).eq('id', id);

  const errors: string[] = r.error ? [r.error] : [];
  if (BREVO) {
    const t = tr(r.lang);
    const text = t.call_text.replace('{channel}', t['ch_' + channel]).replace('{phone}', esc(phone)).replace('{slot}', t['sl_' + slot]);
    try {
      await brevo('/smtp/email', {
        sender: SENDER, replyTo: REPLY_TO, to: [{ email: r.email, name: r.first_name }], subject: t.call_subject,
        htmlContent: layout(r.lang, t.call_title, para(`${esc(t.hello)} ${esc(r.first_name)},<br>${text}`)),
      });
    } catch (e) { errors.push(String((e as Error).message)); }
    try {
      await alertTeam(admin, `Préconsultation par téléphone : ${r.first_name} (${r.profile})`, 'Préconsultation par téléphone demandée', [
        ['Prénom', r.first_name], ['E-mail', r.email], ['Profil', r.profile], ['Délai', r.timeframe ?? '—'],
        ['Villes', (r.cities ?? []).join(', ') || '—'], ['Type de bien', (r.property_types ?? []).join(', ') || '—'],
        ['À appeler', `${phone} (${channel === 'whatsapp' ? 'WhatsApp' : 'téléphone'})`], ['Moment', slot], ['Fuseau horaire', tz ?? '—'],
      ]);
    } catch (e) { errors.push(String((e as Error).message)); }
    try { await ensureAttributes(); await brevo('/contacts', { email: r.email, attributes: { SUITE: 'telephone', TELEPHONE: phone }, updateEnabled: true }); }
    catch (e) { errors.push(String((e as Error).message)); }
  } else {
    errors.push('brevo_not_configured');
  }
  await admin.from('brochure_requests').update({ error: errors.join(' | ').slice(0, 2000) || null }).eq('id', id);
  return out(200, { ok: true });
}

// rappel du questionnaire, envoyé par un admin connecté depuis l'espace de gestion
async function sendReminder(admin: SupabaseClient, req: Request, b: Record<string, unknown>, out: (s: number, body: unknown) => Response) {
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: u } = await admin.auth.getUser(token);
  const who = u?.user?.email?.toLowerCase();
  if (!who) return out(401, { error: 'auth' });
  const { data: isAdmin } = await admin.from('admins').select('email').ilike('email', who).maybeSingle();
  if (!isAdmin) return out(403, { error: 'admin' });

  const id = clean(b.id, 40);
  const { data: r } = await admin.from('brochure_requests').select('*').eq('id', id).maybeSingle();
  if (!r) return out(404, { error: 'request' });
  if (r.profile === 'seller') return out(400, { error: 'seller' });
  if (!BREVO) return out(500, { error: 'brevo_not_configured' });
  const t = tr(r.lang);
  try {
    await brevo('/smtp/email', {
      sender: SENDER, replyTo: REPLY_TO, to: [{ email: r.email, name: r.first_name }], subject: t.reminder_subject,
      htmlContent: layout(r.lang, t.reminder_title, para(`${esc(t.hello)} ${esc(r.first_name)},<br>${esc(t.reminder)}`)
        + button(t.next_cta, questionnaireUrl(r.lang, r.profile, r.id), true) + para(esc(t.reminder_after))),
    });
  } catch (e) { console.error(e); return out(502, { error: 'send' }); }
  const sent = new Date().toISOString();
  await admin.from('brochure_requests').update({ reminder_sent_at: sent }).eq('id', id);
  return out(200, { ok: true, reminder_sent_at: sent });
}

// lien signé vers la brochure du profil (repli sur la version française), ou null si le fichier manque
async function brochureUrl(admin: SupabaseClient, profile: string, lang: string) {
  for (const name of [`${profile}-${lang}.pdf`, `${profile}-fr.pdf`]) {
    const { data } = await admin.storage.from('brochures').createSignedUrl(name, LINK_DAYS * 86400, { download: true });
    if (data?.signedUrl) return data.signedUrl;
  }
  return null;
}

// questionnaire ouvert depuis l'e-mail de la brochure : prénom, e-mail et WhatsApp déjà donnés
async function prefill(admin: SupabaseClient, b: Record<string, unknown>, out: (s: number, body: unknown) => Response) {
  const ref = clean(b.ref, 40);
  if (!/^[0-9a-f-]{36}$/.test(ref)) return out(400, { error: 'invalid' });
  const since = new Date(Date.now() - 120 * 86400 * 1000).toISOString();
  const { data: r } = await admin.from('brochure_requests').select('first_name,email,whatsapp').eq('id', ref).gte('created_at', since).maybeSingle();
  if (!r) return out(404, { error: 'request' });
  return out(200, r);
}

// e-mail de confirmation après le questionnaire, une seule fois par questionnaire reçu dans les 15 dernières minutes ;
// la brochure y est jointe si le client ne l'a pas encore demandée
async function questionnaireDone(admin: SupabaseClient, b: Record<string, unknown>, out: (s: number, body: unknown) => Response) {
  const email = clean(b.email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return out(400, { error: 'invalid' });
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { data: rows } = await admin.from('preconsultations').select('*').ilike('email', email).gte('created_at', since).order('created_at', { ascending: false }).limit(1);
  const p = rows?.[0];
  if (!p) return out(404, { error: 'questionnaire' });
  const day = new Date(Date.now() - 86400 * 1000).toISOString();
  const { data: done } = await admin.from('preconsultations').select('id').ilike('email', email).gte('confirmation_sent_at', day).limit(1);
  if (done?.length) return out(200, { ok: true, skipped: true });
  if (!BREVO) return out(500, { error: 'brevo_not_configured' });

  const lang = LANGS.includes(p.lang) ? p.lang : 'fr';
  const t = tr(lang);
  const first = clean(String(p.full_name ?? '').split(' ')[0], 60);
  const hello = `${esc(t.hello)} ${esc(first)},<br>`;
  const pro = !!p.category && p.category !== 'Appartement';
  const situation = String(p.raw?.profil ?? '');
  const profile = situation.startsWith('Résident') ? 'resident' : situation === 'Étranger(ère) résidant à l’étranger' ? 'international' : 'mre';

  let body: string, withBrochure = false;
  if (pro) {
    body = para(hello + esc(t.q_pro)) + para(esc(t.q_after));
  } else {
    body = para(hello + esc(t.q_text));
    const { data: had } = await admin.from('brochure_requests').select('id').ilike('email', email).limit(1);
    if (!had?.length) {
      const url = await brochureUrl(admin, profile, lang);
      if (url) {
        withBrochure = true;
        body += para(esc(t.q_brochure)) + button(t.download, url, true) + `<p style="margin:-6px 0 22px;font-size:12px;color:#657384">${esc(t.validity)}</p>`;
      } else body += para(esc(t.q_brochure_later));
    }
    body += para(esc(t.q_after));
  }
  try {
    await brevo('/smtp/email', {
      sender: SENDER, replyTo: REPLY_TO, to: [{ email, name: first }], subject: t.q_subject,
      htmlContent: layout(lang, pro ? t.q_pro_title : t.q_title, body),
    });
  } catch (e) { console.error(e); return out(502, { error: 'send' }); }
  await admin.from('preconsultations').update({ confirmation_sent_at: new Date().toISOString(), confirmation_brochure: withBrochure }).eq('id', p.id);
  return out(200, { ok: true, brochure: withBrochure });
}

Deno.serve(async (req) => {
  const h = { ...cors(req), 'Content-Type': 'application/json' };
  const out = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: h });
  if (req.method === 'OPTIONS') return new Response('ok', { headers: h });
  if (req.method !== 'POST') return out(405, { error: 'method' });

  const b = await req.json().catch(() => ({}));
  if (clean(b.website)) return out(200, { ok: true, delivered: true }); // champ piège anti-robots

  const admin = createClient(SB_URL, SERVICE, { auth: { persistSession: false } });
  if (b.action === 'call') return requestCall(admin, b, out);
  if (b.action === 'reminder') return sendReminder(admin, req, b, out);
  if (b.action === 'prefill') return prefill(admin, b, out);
  if (b.action === 'questionnaire') return questionnaireDone(admin, b, out);

  const email = clean(b.email, 160).toLowerCase();
  const first = clean(b.first_name, 60);
  const profile = String(b.profile ?? '');
  const lang = LANGS.includes(b.lang) ? b.lang : 'fr';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !first || !PROFILES.includes(profile as typeof PROFILES[number])) {
    return out(400, { error: 'invalid' });
  }
  const row = {
    lang, email, first_name: first, profile,
    page: clean(b.page, 200) || null,
    whatsapp: clean(b.whatsapp, 30) || null,
    timeframe: TIMEFRAMES.includes(b.timeframe) ? b.timeframe : null,
    cities: list(b.cities),
    property_types: list(b.property_types),
    newsletter: b.newsletter === true,
  };

  // même adresse dans les 10 dernières minutes : on ne renvoie pas
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: recent } = await admin.from('brochure_requests').select('id,email_sent').eq('email', email).gte('created_at', since).order('created_at', { ascending: false }).limit(1);
  if (recent?.length) return out(200, { ok: true, id: recent[0].id, delivered: recent[0].email_sent });

  const { data: saved, error: insErr } = await admin.from('brochure_requests').insert(row).select('id').single();
  if (insErr) { console.error(insErr); return out(500, { error: 'save' }); }

  const errors: string[] = [];
  let emailSent = false, synced = false;
  const t = tr(lang);
  const seller = profile === 'seller';

  if (BREVO) {
    // 1. la brochure, par un lien signé valable 30 jours
    const url = await brochureUrl(admin, profile, lang);
    try {
      const hello = `${esc(t.hello)} ${esc(first)},<br>`;
      if (url) {
        const next = seller
          ? para(esc(t.next_seller)) + button(t.next_seller_cta, WHATSAPP, false)
          : para(esc(t.next)) + button(t.next_cta, questionnaireUrl(lang, profile, saved.id), false);
        await brevo('/smtp/email', {
          sender: SENDER, replyTo: REPLY_TO, to: [{ email, name: first }], subject: t.subject,
          htmlContent: layout(lang, t.title, para(hello + esc(seller ? t.intro_seller : t.intro)) + button(t.download, url, true)
            + `<p style="margin:-6px 0 22px;font-size:12px;color:#657384">${esc(t.validity)}</p>` + next),
        });
        emailSent = true;
      } else {
        errors.push('brochure_missing');
        await brevo('/smtp/email', {
          sender: SENDER, replyTo: REPLY_TO, to: [{ email, name: first }], subject: t.pending_subject,
          htmlContent: layout(lang, t.pending_title, para(hello + esc(t.pending))
            + (seller ? '' : para(esc(t.next)) + button(t.next_cta, questionnaireUrl(lang, profile, saved.id), false))),
        });
      }
    } catch (e) { errors.push(String((e as Error).message)); }

    // 2. le contact dans Brevo, avec ses critères ; la newsletter seulement avec son accord
    const listIds = [LIST_BROCHURE, row.newsletter ? LIST_NEWSLETTER : 0].filter((n) => n > 0);
    try {
      const firstAttr = await ensureAttributes();
      const attributes = {
        [firstAttr]: first, PROFIL: profile, DELAI: row.timeframe ?? '', VILLES: row.cities.join(', '),
        TYPE_BIEN: row.property_types.join(', '), TELEPHONE: row.whatsapp ?? '', LANGUE: lang,
      };
      await brevo('/contacts', { email, attributes, listIds, updateEnabled: true });
      synced = true;
    } catch (e) {
      // attributs absents dans Brevo : on garde au moins le contact et ses listes
      errors.push(String((e as Error).message));
      try { await brevo('/contacts', { email, listIds, updateEnabled: true }); synced = true; } catch (e2) { errors.push(String((e2 as Error).message)); }
    }

    // 3. alerte à l'équipe pour un projet à moins de 3 mois, un vendeur ou une brochure manquante
    if (row.timeframe === 'lt3m' || seller || !url) {
      try {
        await alertTeam(admin, `Demande de brochure : ${first} (${profile})`, 'Nouvelle demande de brochure', [
          ['Profil', profile], ['Délai', row.timeframe ?? '—'], ['Villes', row.cities.join(', ') || '—'],
          ['Type de bien', row.property_types.join(', ') || '—'], ['WhatsApp', row.whatsapp ?? '—'], ['E-mail', email],
          ['Brochure', url ? 'envoyée' : 'À ENVOYER À LA MAIN (fichier absent)'],
        ]);
      } catch (e) { errors.push(String((e as Error).message)); }
    }
  } else {
    errors.push('brevo_not_configured');
  }

  await admin.from('brochure_requests').update({ email_sent: emailSent, brevo_synced: synced, error: errors.join(' | ').slice(0, 2000) || null }).eq('id', saved.id);
  return out(200, { ok: true, id: saved.id, delivered: emailSent });
});
