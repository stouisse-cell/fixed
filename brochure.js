/* ============================================================
   RAHIM INTERNATIONAL — DEMANDE DE BROCHURE
   Formulaire unique (FR, EN, AR), chargé par shared.js.
   - <section data-brochure-section data-profile="mre"> : section complète dans la page
   - tout lien [data-brochure] : va au formulaire de la page, sinon l’ouvre dans une fenêtre
   Le lien vers le questionnaire de préconsultation est envoyé dans l’e-mail de la brochure.
   ============================================================ */
(function () {
  'use strict';
  if (window.RI_BROCHURE) return;
  window.RI_BROCHURE = true;

  var ENDPOINT = 'https://djaverrqyhemgyypuvbw.supabase.co/functions/v1/brochure-request';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqYXZlcnJxeWhlbWd5eXB1dmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3OTQ3MzEsImV4cCI6MjEwODM3MDczMX0.bcNmZ7PIoqb78z3WZNKbZAQSRwXBCm3T9EVG1N1cUhU';
  var WHATSAPP = 'https://wa.me/212642773249';
  var me = document.currentScript || document.querySelector('script[src*="brochure.js"]');
  var ROOT = me ? me.src.replace(/brochure\.js(\?.*)?$/, '') : '/';
  var lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  if (lang !== 'fr' && lang !== 'ar') lang = 'en';

  var T = {
    fr: {
      title: 'Recevez notre brochure',
      lead: {
        mre: 'Vous prévoyez d’acheter au pays ?',
        resident: 'Vous préparez un achat au Maroc ?',
        international: 'Vous envisagez d’investir au Maroc ?',
        seller: 'Vous souhaitez vendre un bien ou commercialiser un programme ?',
        any: 'Vous avez un projet immobilier au Maroc ?'
      },
      intro: 'Indiquez-nous en quelques mots où en est votre projet, et nous vous envoyons par e-mail la brochure qui correspond à votre situation.',
      inside: 'Dans la brochure',
      items: ['Nos formules et ce que chacune inclut', 'Nos honoraires et nos offres en cours', 'Des exemples des documents que vous recevez', 'Notre accompagnement pour l’achat sur plan et le suivi de chantier'],
      after: 'Avec la brochure, vous recevez le lien vers notre questionnaire de préconsultation, à remplir lorsque vous serez prêt à avancer.',
      first: 'Prénom', email: 'E-mail', you: 'Vous êtes',
      profiles: { mre: 'Marocain résidant à l’étranger', resident: 'Résident au Maroc', international: 'Investisseur international', seller: 'Vendeur ou promoteur' },
      when_buy: 'Quand souhaitez-vous acheter ?', when_sell: 'Quand souhaitez-vous vendre ?',
      times: { lt3m: 'Dans les 3 mois', '3to12m': 'Dans 3 à 12 mois', gt12m: 'Dans plus d’un an', info: 'Je m’informe pour l’instant' },
      cities: 'Villes', other_city: 'Autre ville',
      types: 'Type de bien',
      type_labels: ['Appartement', 'Programme neuf (sur plan)', 'Villa', 'Terrain', 'Local commercial'],
      optional: 'facultatif', site: 'Site web',
      submit: 'Recevoir la brochure',
      legal: 'Vos informations servent à vous envoyer la brochure et à vous recontacter au sujet de votre projet.',
      privacy: 'Politique de confidentialité',
      err_fields: 'Merci d’indiquer votre prénom et une adresse e-mail valide.',
      err_profile: 'Merci d’indiquer votre situation.',
      err_send: 'L’envoi n’a pas abouti. Merci de réessayer, ou de nous écrire sur <a href="' + WHATSAPP + '">WhatsApp</a>.',
      thanks: 'Merci, {name}.',
      sent: 'Votre brochure vient de vous être envoyée par e-mail. Si vous ne la trouvez pas, pensez à vérifier vos courriers indésirables.',
      pending: 'Votre demande est bien enregistrée. Votre brochure vous sera envoyée par e-mail dans les prochaines heures.',
      next_buy: 'Notre e-mail contient aussi le lien vers le questionnaire de préconsultation, à remplir lorsque vous serez prêt. Vous préférez faire le point par téléphone ?',
      next_sell: 'Souhaitez-vous que nous vous appelions pour parler de votre bien ?',
      call_open_buy: 'Faire ma préconsultation par téléphone', call_open_sell: 'Être rappelé',
      phone: 'Numéro à appeler', channel: 'Nous vous appelons', by_phone: 'Par téléphone', by_wa: 'Sur WhatsApp',
      slot: 'Le meilleur moment pour vous (heure de votre pays)',
      slots: { morning: 'Le matin', afternoon: 'L’après-midi', evening: 'En soirée', any: 'Peu importe' },
      call_send: 'Demander un appel',
      err_phone: 'Merci d’indiquer un numéro de téléphone valide, avec l’indicatif du pays.',
      call_done: '<strong>C’est noté.</strong> Nous vous contacterons pour faire le point sur votre projet. Cet échange remplace le questionnaire en ligne : vous n’avez rien d’autre à préparer.',
      close: 'Fermer'
    },
    en: {
      title: 'Receive our brochure',
      lead: {
        mre: 'Planning to buy back home?',
        resident: 'Preparing a purchase in Morocco?',
        international: 'Considering an investment in Morocco?',
        seller: 'Looking to sell a property or market a development?',
        any: 'Do you have a property project in Morocco?'
      },
      intro: 'Tell us in a few words where your project stands, and we will email you the brochure that matches your situation.',
      inside: 'In the brochure',
      items: ['Our service packages and what each one includes', 'Our fees and current offers', 'Examples of the documents you receive', 'Our support for off-plan purchases and construction follow-up'],
      after: 'With the brochure, you receive the link to our pre-consultation questionnaire, to fill in when you are ready to move forward.',
      first: 'First name', email: 'Email', you: 'You are',
      profiles: { mre: 'A Moroccan living abroad', resident: 'A resident of Morocco', international: 'An international investor', seller: 'A seller or developer' },
      when_buy: 'When would you like to buy?', when_sell: 'When would you like to sell?',
      times: { lt3m: 'Within 3 months', '3to12m': 'In 3 to 12 months', gt12m: 'In more than a year', info: 'I am only looking for now' },
      cities: 'Cities', other_city: 'Another city',
      types: 'Type of property',
      type_labels: ['Apartment', 'New development (off-plan)', 'Villa', 'Land', 'Commercial premises'],
      optional: 'optional', site: 'Website',
      submit: 'Receive the brochure',
      legal: 'Your information is used to send you the brochure and to contact you about your project.',
      privacy: 'Privacy policy',
      err_fields: 'Please enter your first name and a valid email address.',
      err_profile: 'Please tell us your situation.',
      err_send: 'Your request could not be sent. Please try again, or write to us on <a href="' + WHATSAPP + '">WhatsApp</a>.',
      thanks: 'Thank you, {name}.',
      sent: 'Your brochure has just been sent to you by email. If you cannot find it, please check your spam folder.',
      pending: 'Your request has been received. Your brochure will be sent to you by email within the next few hours.',
      next_buy: 'Our email also contains the link to the pre-consultation questionnaire, to fill in when you are ready. Would you rather talk it through by phone?',
      next_sell: 'Would you like us to call you to discuss your property?',
      call_open_buy: 'Do my pre-consultation by phone', call_open_sell: 'Request a call',
      phone: 'Number to call', channel: 'We will call you', by_phone: 'By phone', by_wa: 'On WhatsApp',
      slot: 'The best time for you (your local time)',
      slots: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', any: 'Any time' },
      call_send: 'Request a call',
      err_phone: 'Please enter a valid phone number, including the country code.',
      call_done: '<strong>Noted.</strong> We will contact you to discuss your project. This call replaces the online questionnaire, so there is nothing else to prepare.',
      close: 'Close'
    },
    ar: {
      title: 'احصل على كتيّبنا',
      lead: {
        mre: 'هل تخطط للشراء في المغرب؟',
        resident: 'هل تحضّر لشراء عقار في المغرب؟',
        international: 'هل تفكر في الاستثمار في المغرب؟',
        seller: 'هل ترغب في بيع عقار أو تسويق مشروع؟',
        any: 'هل لديك مشروع عقاري في المغرب؟'
      },
      intro: 'أخبرنا في كلمات قليلة أين وصل مشروعك، وسنرسل إليك عبر البريد الإلكتروني الكتيّب الذي يناسب وضعك.',
      inside: 'في الكتيّب',
      items: ['باقاتنا وما تشمله كل واحدة منها', 'أتعابنا وعروضنا الحالية', 'نماذج من الوثائق التي تتوصل بها', 'مرافقتنا في الشراء على التصميم ومتابعة الورش'],
      after: 'مع الكتيّب، تتوصل برابط استبيان ما قبل الاستشارة، لتملأه حين تكون مستعداً للمضي قدماً.',
      first: 'الاسم الشخصي', email: 'البريد الإلكتروني', you: 'أنت',
      profiles: { mre: 'مغربي مقيم بالخارج', resident: 'مقيم بالمغرب', international: 'مستثمر دولي', seller: 'بائع أو منعش عقاري' },
      when_buy: 'متى ترغب في الشراء؟', when_sell: 'متى ترغب في البيع؟',
      times: { lt3m: 'خلال 3 أشهر', '3to12m': 'خلال 3 إلى 12 شهراً', gt12m: 'بعد أكثر من سنة', info: 'أستطلع فقط في الوقت الحالي' },
      cities: 'المدن', other_city: 'مدينة أخرى',
      types: 'نوع العقار',
      type_labels: ['شقة', 'مشروع جديد (على التصميم)', 'فيلا', 'أرض', 'محل تجاري'],
      optional: 'اختياري', site: 'الموقع',
      submit: 'احصل على الكتيّب',
      legal: 'تُستعمل معلوماتك لإرسال الكتيّب إليك وللتواصل معك بشأن مشروعك.',
      privacy: 'سياسة الخصوصية',
      err_fields: 'المرجو إدخال اسمك الشخصي وعنوان بريد إلكتروني صحيح.',
      err_profile: 'المرجو تحديد وضعك.',
      err_send: 'تعذّر الإرسال. المرجو إعادة المحاولة، أو مراسلتنا عبر <a href="' + WHATSAPP + '">واتساب</a>.',
      thanks: 'شكراً، {name}.',
      sent: 'أُرسل إليك الكتيّب للتو عبر البريد الإلكتروني. إن لم تجده، المرجو التحقق من مجلد الرسائل غير المرغوب فيها.',
      pending: 'تم تسجيل طلبك. سيُرسل إليك الكتيّب عبر البريد الإلكتروني خلال الساعات القادمة.',
      next_buy: 'تتضمن رسالتنا أيضاً رابط استبيان ما قبل الاستشارة، لتملأه حين تكون مستعداً. هل تفضّل أن نتحدث عبر الهاتف؟',
      next_sell: 'هل تريد أن نتصل بك للحديث عن عقارك؟',
      call_open_buy: 'إجراء ما قبل الاستشارة عبر الهاتف', call_open_sell: 'طلب اتصال',
      phone: 'الرقم الذي نتصل به', channel: 'نتصل بك', by_phone: 'عبر الهاتف', by_wa: 'عبر واتساب',
      slot: 'أنسب وقت لك (بتوقيت بلدك)',
      slots: { morning: 'صباحاً', afternoon: 'بعد الظهر', evening: 'مساءً', any: 'أي وقت' },
      call_send: 'طلب اتصال',
      err_phone: 'المرجو إدخال رقم هاتف صحيح مع رمز البلد.',
      call_done: '<strong>تم تسجيل طلبك.</strong> سنتصل بك للحديث عن مشروعك. يعوّض هذا الاتصال الاستبيان الإلكتروني، فلا شيء آخر عليك تحضيره.',
      close: 'إغلاق'
    }
  }[lang];

  var CITY_VALUES = ['Kénitra', 'Rabat', 'Salé', 'Autre ville'];
  var CITY_LABELS = { fr: ['Kénitra', 'Rabat', 'Salé'], en: ['Kenitra', 'Rabat', 'Salé'], ar: ['القنيطرة', 'الرباط', 'سلا'] }[lang].concat(T.other_city);
  var TYPE_VALUES = ['Appartement', 'Programme neuf (sur plan)', 'Villa', 'Terrain', 'Local commercial'];
  var PROFILES = ['mre', 'resident', 'international', 'seller'];

  // profil proposé par défaut selon la page
  function pageProfile() {
    var p = location.pathname;
    if (/investors-mre|mre-buying-guide/.test(p)) return 'mre';
    if (/foreign-investor-guide/.test(p)) return 'international';
    if (/investors-local/.test(p)) return 'resident';
    if (/investors-international/.test(p)) return 'international';
    if (/services-developers/.test(p)) return 'seller';
    return '';
  }

  var CSS = [
    '.bro-sec{background:var(--navy,#081a33);color:#fff;padding:clamp(4rem,7vw,7rem) 5%}',
    '.bro-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:3rem;align-items:start}',
    '.bro-copy .section-title{color:#fff}',
    '.bro-copy p{line-height:1.8;color:rgba(255,255,255,.78)}',
    '.bro-label{margin:1.8rem 0 .9rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--copper,#C9A96E)}',
    '.bro-list{list-style:none;margin:0;padding:0;display:grid;gap:.6rem}',
    '.bro-list li{position:relative;padding-inline-start:1.4rem;line-height:1.6;color:rgba(255,255,255,.85)}',
    '.bro-list li::before{content:"";position:absolute;inset-inline-start:0;top:.55em;width:.5rem;height:.5rem;border:1px solid var(--copper,#C9A96E);transform:rotate(45deg)}',
    '.bro-after{margin-top:1.8rem;font-size:.92rem;color:rgba(255,255,255,.65)!important}',
    '.bro-form{background:#fff;padding:1.8rem;display:grid;gap:1.2rem;color:#3d4a5c;border-top:2px solid var(--copper,#C9A96E);text-align:start}',
    '.bro-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem}',
    '.bro-field{display:grid;gap:.4rem;font-size:.85rem;color:var(--navy,#081a33)}',
    '.bro-field em{color:#5a6475;font-style:normal}',
    '.bro-field input,.bro-field select{width:100%;box-sizing:border-box;min-height:46px;padding:.7rem .8rem;border:1px solid #cfd8e0;border-radius:0;font:inherit;font-size:1rem;color:var(--navy,#081a33);background:#fff}',
    '.bro-field input:focus,.bro-field select:focus{outline:2px solid var(--copper,#C9A96E);outline-offset:1px;border-color:var(--copper,#C9A96E)}',
    '.bro-chips{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.5rem}',
    '.bro-chips legend{padding:0;margin-bottom:.5rem;font-size:.85rem;color:var(--navy,#081a33)}',
    '.bro-chips label{position:relative}',
    '.bro-chips input{position:absolute;opacity:0;width:1px;height:1px}',
    '.bro-chips span{display:inline-flex;align-items:center;min-height:40px;padding:.45rem .9rem;border:1px solid #cfd8e0;font-size:.9rem;color:var(--navy,#081a33);cursor:pointer}',
    '.bro-chips input:checked+span{background:var(--navy,#081a33);border-color:var(--navy,#081a33);color:#fff}',
    '.bro-chips input:focus-visible+span{outline:2px solid var(--copper,#C9A96E);outline-offset:2px}',
    '.bro-form .btn-gold,.bro-form .btn-outline-dark{justify-self:start;cursor:pointer;font-family:inherit}',
    '.bro-form .btn-gold{border:0}',
    '.bro-form .btn-outline-dark{background:transparent;border:1px solid var(--navy,#081a33);color:var(--navy,#081a33)}',
    '.bro-form button[disabled]{opacity:.6;cursor:wait}',
    '.bro-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}',
    '.bro-msg{margin:0;font-size:.95rem;line-height:1.6;color:var(--navy,#081a33)}',
    '.bro-msg:empty{display:none}',
    '.bro-msg.is-error{color:#9a3e39}',
    '.bro-msg a{color:inherit}',
    '.bro-legal{margin:0;font-size:.78rem;line-height:1.6;color:#5a6475}',
    '.bro-legal a{color:inherit}',
    '.bro-done h3{font-family:"Cormorant Garamond",serif;font-weight:400;font-size:1.7rem;color:var(--navy,#081a33);margin:0 0 .6rem}',
    '.bro-done p{margin:0 0 1rem;line-height:1.8}',
    '.bro-call{display:grid;gap:1.2rem}',
    '.bro-call[hidden],.bro-done [hidden]{display:none}',
    '.bro-done .bro-next-q{margin-top:1.6rem;padding-top:1.4rem;border-top:1px solid #e3dccd;color:var(--navy,#081a33);font-weight:600}',
    '.bro-dialog{position:fixed;inset:0;margin:auto;height:fit-content;border:0;padding:0;width:min(640px,calc(100vw - 32px));max-height:calc(100vh - 32px);background:transparent;overflow:visible}',
    '.bro-dialog::backdrop{background:rgba(7,17,31,.72)}',
    '.bro-dialog-inner{position:relative;max-height:calc(100vh - 32px);overflow:auto;background:#fff}',
    '.bro-dialog-head{background:var(--navy,#081a33);color:#fff;padding:1.6rem 1.8rem 1.4rem;padding-inline-end:3.6rem}',
    '.bro-dialog-head h2{font-family:"Cormorant Garamond",serif;font-weight:400;font-size:1.9rem;margin:0 0 .5rem;color:#fff}',
    '.bro-dialog-head p{margin:0;line-height:1.7;font-size:.95rem;color:rgba(255,255,255,.78)}',
    '.bro-dialog .bro-form{border-top:0}',
    '.bro-close{position:absolute;top:.8rem;inset-inline-end:.8rem;width:40px;height:40px;border:0;background:transparent;color:#fff;font-size:1.6rem;line-height:1;cursor:pointer}',
    '.bro-close:focus-visible{outline:2px solid var(--copper,#C9A96E)}',
    'html.bro-lock{overflow:hidden}',
    '@media (max-width:900px){.bro-grid{grid-template-columns:minmax(0,1fr);gap:2rem}}',
    '@media (max-width:560px){.bro-row{grid-template-columns:minmax(0,1fr)}.bro-form{padding:1.3rem}.bro-dialog-head{padding:1.3rem;padding-inline-end:3.4rem}}'
  ].join('\n');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function chips(type, name, values, labels, checked) {
    return values.map(function (v, i) {
      return '<label><input type="' + type + '" name="' + name + '" value="' + esc(v) + '"' + (v === checked ? ' checked' : '') + '><span>' + esc(labels[i]) + '</span></label>';
    }).join('');
  }

  function formHtml(profile) {
    var times = ['lt3m', '3to12m', 'gt12m', 'info'];
    return '<form class="bro-form" novalidate>' +
      '<div class="bro-row">' +
        '<label class="bro-field"><span>' + T.first + '</span><input name="first_name" type="text" autocomplete="given-name" required maxlength="60"></label>' +
        '<label class="bro-field"><span>' + T.email + '</span><input name="email" type="email" autocomplete="email" required maxlength="160" dir="ltr"></label>' +
      '</div>' +
      '<fieldset class="bro-chips"><legend>' + T.you + '</legend>' + chips('radio', 'profile', PROFILES, PROFILES.map(function (p) { return T.profiles[p]; }), profile) + '</fieldset>' +
      '<label class="bro-field"><span class="bro-when">' + (profile === 'seller' ? T.when_sell : T.when_buy) + '</span><select name="timeframe">' +
        times.map(function (v) { return '<option value="' + v + '"' + (v === '3to12m' ? ' selected' : '') + '>' + T.times[v] + '</option>'; }).join('') +
      '</select></label>' +
      '<fieldset class="bro-chips"><legend>' + T.cities + '</legend>' + chips('checkbox', 'cities', CITY_VALUES, CITY_LABELS) + '</fieldset>' +
      '<fieldset class="bro-chips"><legend>' + T.types + '</legend>' + chips('checkbox', 'property_types', TYPE_VALUES, T.type_labels) + '</fieldset>' +
      '<label class="bro-field"><span>WhatsApp <em>(' + T.optional + ')</em></span><input name="whatsapp" type="tel" autocomplete="tel" maxlength="30" placeholder="+33 6 12 34 56 78" dir="ltr"></label>' +
      '<label class="bro-hp" aria-hidden="true">' + T.site + '<input name="website" type="text" tabindex="-1" autocomplete="off"></label>' +
      '<button type="submit" class="btn-gold">' + T.submit + '</button>' +
      '<p class="bro-msg" role="status" aria-live="polite"></p>' +
      '<p class="bro-legal">' + T.legal + ' <a href="' + ROOT + 'privacy-policy.html">' + T.privacy + '</a></p>' +
    '</form>';
  }

  function post(body) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': KEY, 'Authorization': 'Bearer ' + KEY },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json().then(function (d) { if (!r.ok) throw d; return d; }); });
  }

  // préconsultation par téléphone, proposée juste après la demande de brochure
  function callStep(form, id) {
    var box = form.querySelector('.bro-call'), open = form.querySelector('.bro-call-open');
    open.addEventListener('click', function () { box.hidden = false; open.hidden = true; box.querySelector('input').focus(); });
    box.querySelector('.bro-call-send').addEventListener('click', function () {
      var m = box.querySelector('.bro-msg'), phone = box.querySelector('[name=phone]').value.trim(), send = this;
      if ((phone.match(/\d/g) || []).length < 6) { m.className = 'bro-msg is-error'; m.textContent = T.err_phone; return; }
      var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      send.disabled = true;
      post({ action: 'call', id: id, phone: phone, channel: box.querySelector('[name=channel]:checked').value, slot: box.querySelector('[name=slot]').value, timezone: tz })
        .then(function () {
          if (typeof gtag === 'function') gtag('event', 'request_call', { form: 'brochure' });
          box.innerHTML = '<p>' + T.call_done + '</p>';
          var q = form.querySelector('.bro-next-q'); if (q) q.hidden = true;
        })
        .catch(function () { send.disabled = false; m.className = 'bro-msg is-error'; m.innerHTML = T.err_send; });
    });
  }

  function bind(form) {
    var msg = form.querySelector('.bro-msg'), btn = form.querySelector('button[type=submit]'), when = form.querySelector('.bro-when');
    function values(name) { return [].map.call(form.querySelectorAll('[name="' + name + '"]:checked'), function (i) { return i.value; }); }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'profile') when.textContent = e.target.value === 'seller' ? T.when_sell : T.when_buy;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.className = 'bro-msg'; msg.textContent = '';
      var first = form.first_name.value.trim(), email = form.email.value.trim(), profile = values('profile')[0];
      if (!first || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        msg.className = 'bro-msg is-error'; msg.textContent = T.err_fields;
        (first ? form.email : form.first_name).focus(); return;
      }
      if (!profile) { msg.className = 'bro-msg is-error'; msg.textContent = T.err_profile; form.querySelector('[name=profile]').focus(); return; }
      btn.disabled = true;
      post({
        lang: lang, page: location.pathname, first_name: first, email: email,
        profile: profile, timeframe: form.timeframe.value,
        cities: values('cities'), property_types: values('property_types'),
        whatsapp: form.whatsapp.value.trim(), website: form.website.value
      })
        .then(function (d) {
          var seller = profile === 'seller', phone = esc(form.whatsapp.value.trim());
          if (typeof gtag === 'function') gtag('event', 'generate_lead', { form: 'brochure', profile: profile });
          form.innerHTML = '<div class="bro-done"><h3>' + T.thanks.replace('{name}', esc(first)) + '</h3>' +
            '<p>' + (d.delivered ? T.sent : T.pending) + '</p>' +
            '<p class="bro-next-q">' + (seller ? T.next_sell : T.next_buy) + '</p>' +
            '<button type="button" class="btn-outline-dark bro-call-open">' + (seller ? T.call_open_sell : T.call_open_buy) + '</button>' +
            '<div class="bro-call" hidden>' +
              '<label class="bro-field"><span>' + T.phone + '</span><input name="phone" type="tel" autocomplete="tel" maxlength="30" value="' + phone + '" placeholder="+33 6 12 34 56 78" dir="ltr"></label>' +
              '<fieldset class="bro-chips"><legend>' + T.channel + '</legend>' + chips('radio', 'channel', ['phone', 'whatsapp'], [T.by_phone, T.by_wa], 'phone') + '</fieldset>' +
              '<label class="bro-field"><span>' + T.slot + '</span><select name="slot">' +
                ['morning', 'afternoon', 'evening', 'any'].map(function (v) { return '<option value="' + v + '"' + (v === 'any' ? ' selected' : '') + '>' + T.slots[v] + '</option>'; }).join('') +
              '</select></label>' +
              '<button type="button" class="btn-gold bro-call-send">' + T.call_send + '</button>' +
              '<p class="bro-msg" role="status" aria-live="polite"></p>' +
            '</div></div>';
          callStep(form, d.id);
        })
        .catch(function () { btn.disabled = false; msg.className = 'bro-msg is-error'; msg.innerHTML = T.err_send; });
    });
    return form;
  }

  function mountForm(container, profile) {
    container.insertAdjacentHTML('beforeend', formHtml(profile));
    return bind(container.lastElementChild);
  }

  // section complète dans la page
  function renderSection(sec) {
    var profile = sec.getAttribute('data-profile') || '';
    if (PROFILES.indexOf(profile) < 0) profile = '';
    sec.classList.add('bro-sec');
    sec.innerHTML = '<div class="bro-grid"><div class="bro-copy">' +
      '<h2 class="section-title">' + T.title + '</h2>' +
      '<p>' + T.lead[profile || 'any'] + ' ' + T.intro + '</p>' +
      (profile === 'seller' ? '' :
        '<p class="bro-label">' + T.inside + '</p><ul class="bro-list">' + T.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
        '<p class="bro-after">' + T.after + '</p>') +
      '</div><div class="bro-slot"></div></div>';
    mountForm(sec.querySelector('.bro-slot'), profile);
  }

  // fenêtre, pour les pages sans section
  var dialog = null;
  function openDialog() {
    if (!dialog) {
      var profile = pageProfile();
      dialog = document.createElement('dialog');
      dialog.className = 'bro-dialog';
      dialog.setAttribute('aria-labelledby', 'bro-dialog-title');
      dialog.innerHTML = '<div class="bro-dialog-inner"><div class="bro-dialog-head"><h2 id="bro-dialog-title">' + T.title + '</h2>' +
        '<p>' + T.lead[profile || 'any'] + ' ' + T.intro + (profile === 'seller' ? '' : ' ' + T.after) + '</p></div>' +
        '<button type="button" class="bro-close" aria-label="' + T.close + '">×</button><div class="bro-slot"></div></div>';
      document.body.appendChild(dialog);
      mountForm(dialog.querySelector('.bro-slot'), profile);
      dialog.querySelector('.bro-close').addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', function () { document.documentElement.classList.remove('bro-lock'); });
    }
    if (typeof dialog.showModal !== 'function') { location.href = ROOT + (lang === 'en' ? '' : lang + '/') + '#brochure'; return; }
    document.documentElement.classList.add('bro-lock');
    dialog.showModal();
    var first = dialog.querySelector('input[name=first_name]');
    if (first) first.focus();
  }

  function closeMobileNav() {
    var open = document.querySelector('.nav-toggle[aria-expanded="true"]');
    if (open) open.click();
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    [].forEach.call(document.querySelectorAll('[data-brochure-section]'), renderSection);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-brochure]');
      if (!a) return;
      e.preventDefault();
      closeMobileNav();
      var sec = document.querySelector('[data-brochure-section]');
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var input = sec.querySelector('input[name=first_name]');
        if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, 500);
      } else openDialog();
    });
    if (location.hash === '#brochure' && !document.querySelector('[data-brochure-section]')) openDialog();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
