/* ============================================================
   RAHIM INTERNATIONAL — SHARED JAVASCRIPT
   ============================================================ */

(function() {
  'use strict';

  const LANG_STORAGE_KEY = 'ri_locale';

  function normalizeLocale(value) {
    const locale = String(value || '').trim().toLowerCase();
    if (locale === 'fr' || locale === 'ar' || locale === 'en') return locale;
    return '';
  }

  function persistLocale(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized) return;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, normalized);
    } catch (_) {}
  }

  function detectLocaleFromLink(link) {
    if (!link) return '';
    const explicit = normalizeLocale(link.getAttribute('data-lang-choice'));
    if (explicit) return explicit;
    const textLocale = normalizeLocale(link.textContent);
    if (textLocale) return textLocale;
    const href = link.getAttribute('href') || '';
    if (/\/ar\/|(^|\/)ar\.html$/i.test(href) || /\/ar\/index\.html$/i.test(href)) return 'ar';
    if (/\/fr\/|(^|\/)fr\.html$/i.test(href) || /\/fr\/index\.html$/i.test(href)) return 'fr';
    if (/index\.html$/i.test(href) || href === '/' || href === '../index.html') return 'en';
    return '';
  }

  document.querySelectorAll('.language-switcher a, .footer-langs a, [data-lang-choice]').forEach((link) => {
    link.addEventListener('click', () => {
      persistLocale(detectLocaleFromLink(link));
    });
  });

  // ---- Progress Bar ----
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
  }

  // ---- Back to Top ----
  const backTop = document.querySelector('.btn-back-top');
  function updateBackTop() {
    if (!backTop) return;
    if (window.scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateBackTop();
  }, { passive: true });

  // ---- Mobile Nav Toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('#nav-links');

  function setNavOpen(open) {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!isOpen);
    });
    // Close after clicking a link or a dropdown item
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        setNavOpen(false);
      }
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        !e.target.closest('.site-nav') &&
        navLinks.classList.contains('is-open')
      ) {
        setNavOpen(false);
      }
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        setNavOpen(false);
      }
    });
    // Reset state when crossing back to desktop layout
    const resetOnResize = () => {
      if (
        window.innerWidth > 1450 &&
        navLinks.classList.contains('is-open')
      ) {
        setNavOpen(false);
      }
    };
    window.addEventListener('resize', resetOnResize);
  }

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ---- Gallery ----
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
    const dots = Array.from(gallery.querySelectorAll('.gallery-dot'));
    const prev = gallery.querySelector('.gallery-prev');
    const next = gallery.querySelector('.gallery-next');
    if (!slides.length) return;
    let activeIndex = 0;
    let autoTimer;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === activeIndex));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => showSlide(activeIndex + 1), 5000);
    };

    if (prev) prev.addEventListener('click', () => { showSlide(activeIndex - 1); startAuto(); });
    if (next) next.addEventListener('click', () => { showSlide(activeIndex + 1); startAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startAuto(); }));

    // Keyboard nav
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { showSlide(activeIndex - 1); startAuto(); }
      if (e.key === 'ArrowRight') { showSlide(activeIndex + 1); startAuto(); }
    });

    // Touch swipe nav (mobile)
    // In RTL pages a left-swipe should still feel like "next" visually,
    // so we mirror the direction when the page is RTL.
    const isRTL = document.documentElement.dir === 'rtl';
    const SWIPE_THRESHOLD = 40;
    const SWIPE_MAX_VERTICAL = 60;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;

    gallery.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchActive = true;
      clearInterval(autoTimer);
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      if (!touchActive) return;
      touchActive = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      // Ignore taps and mostly-vertical scrolls
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_MAX_VERTICAL) {
        if (slides.length > 1) startAuto();
        return;
      }
      const goNext = isRTL ? dx > 0 : dx < 0;
      showSlide(activeIndex + (goNext ? 1 : -1));
      startAuto();
    }, { passive: true });

    gallery.addEventListener('touchcancel', () => {
      touchActive = false;
      if (slides.length > 1) startAuto();
    }, { passive: true });

    if (slides.length > 1) startAuto();
  });

  // ---- Contact Form ----
  const form = document.querySelector('#contact-form');
  if (form) {
    const locale = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    const contactCopy = {
      en: {
        primaryGoal: 'Primary Goal',
        primaryGoalPlaceholder: 'Select your objective',
        timeline: 'Timeline',
        timelinePlaceholder: 'Select your timeline',
        preferredContact: 'Preferred Contact',
        preferredContactPlaceholder: 'Select contact preference',
        prefillLabel: 'Start With a Prefilled Message',
        prefillNote: 'Choose a starting point, then edit the message so it matches your exact situation.',
        goalOptions: [
          'Buy a property',
          'Compare an opportunity or area',
          'Understand pricing, financing, or process',
          'Discuss developer services or partnership',
          'Request a consultation call',
          'Other'
        ],
        timelineOptions: [
          'As soon as possible',
          'Within 1-3 months',
          'Within 3-6 months',
          '6+ months',
          'Just researching'
        ],
        contactOptions: ['Email', 'Phone', 'WhatsApp', 'Video call'],
        templates: [
          {
            label: 'Buying in Morocco',
            body: 'Hello, I am exploring buying property in Morocco and would like guidance on the best areas, budget range, and next steps for my situation.'
          },
          {
            label: 'Compare an opportunity',
            body: 'Hello, I am comparing a specific property, project, or area and would like help evaluating price, location, and fit for my goals.'
          },
          {
            label: 'Daam Sakani / financing',
            body: 'Hello, I would like to understand whether I may qualify for Daam Sakani or what financing route makes the most sense for my purchase.'
          },
          {
            label: 'Developer partnership',
            body: 'Hello, I represent a real estate development or project and would like to discuss positioning, marketing, and sales support.'
          },
          {
            label: 'Book a consultation',
            body: 'Hello, I would like to schedule a consultation to discuss my situation and the most relevant next steps.'
          }
        ]
      },
      fr: {
        primaryGoal: 'Objectif principal',
        primaryGoalPlaceholder: 'Sélectionnez votre objectif',
        timeline: 'Calendrier',
        timelinePlaceholder: 'Sélectionnez votre délai',
        preferredContact: 'Contact préféré',
        preferredContactPlaceholder: 'Sélectionnez votre préférence',
        prefillLabel: 'Commencer avec un message prérempli',
        prefillNote: 'Choisissez un point de départ, puis adaptez le message à votre situation exacte.',
        goalOptions: [
          'Acheter un bien',
          'Comparer une opportunité ou une zone',
          'Comprendre les prix, le financement ou le processus',
          'Discuter des services aux promoteurs',
          'Demander un appel de consultation',
          'Autre'
        ],
        timelineOptions: [
          'Le plus vite possible',
          'Sous 1 à 3 mois',
          'Sous 3 à 6 mois',
          'Dans plus de 6 mois',
          'Je fais mes recherches'
        ],
        contactOptions: ['E-mail', 'Téléphone', 'WhatsApp', 'Appel vidéo'],
        templates: [
          {
            label: 'Acheter au Maroc',
            body: 'Bonjour, j\'étudie un achat immobilier au Maroc et je souhaite être orienté sur les meilleures zones, le budget à prévoir et les prochaines étapes adaptées à ma situation.'
          },
          {
            label: 'Comparer une opportunité',
            body: 'Bonjour, je compare un bien, un projet ou une zone et je souhaite une aide pour évaluer le prix, l\'emplacement et l\'adéquation avec mes objectifs.'
          },
          {
            label: 'Daam Sakani / financement',
            body: 'Bonjour, je souhaite comprendre si je peux être éligible à Daam Sakani ou quel mode de financement serait le plus adapté à mon achat.'
          },
          {
            label: 'Partenariat promoteur',
            body: 'Bonjour, je représente un projet immobilier et je souhaite discuter du positionnement, du marketing et de l\'accompagnement commercial.'
          },
          {
            label: 'Planifier une consultation',
            body: 'Bonjour, je souhaite planifier une consultation afin d\'échanger sur ma situation et sur les prochaines étapes les plus pertinentes.'
          }
        ]
      },
      ar: {
        primaryGoal: 'الهدف الرئيسي',
        primaryGoalPlaceholder: 'اختر هدفك',
        timeline: 'الإطار الزمني',
        timelinePlaceholder: 'اختر توقيتك',
        preferredContact: 'طريقة التواصل المفضلة',
        preferredContactPlaceholder: 'اختر طريقة التواصل',
        prefillLabel: 'ابدأ برسالة جاهزة',
        prefillNote: 'اختر نقطة بداية، ثم عدّل الرسالة لتناسب وضعك بشكل دقيق.',
        goalOptions: [
          'شراء عقار',
          'مقارنة فرصة أو منطقة',
          'فهم الأسعار أو التمويل أو الإجراءات',
          'مناقشة خدمات المطورين أو الشراكة',
          'طلب مكالمة استشارية',
          'أمر آخر'
        ],
        timelineOptions: [
          'في أقرب وقت ممكن',
          'خلال 1 إلى 3 أشهر',
          'خلال 3 إلى 6 أشهر',
          'بعد أكثر من 6 أشهر',
          'ما زلت في مرحلة البحث'
        ],
        contactOptions: ['البريد الإلكتروني', 'الهاتف', 'واتساب', 'مكالمة فيديو'],
        templates: [
          {
            label: 'شراء عقار في المغرب',
            body: 'مرحبًا، أنا أدرس شراء عقار في المغرب وأرغب في الحصول على توجيه بخصوص أفضل المناطق، والميزانية المناسبة، والخطوات التالية لحالتي.'
          },
          {
            label: 'مقارنة فرصة',
            body: 'مرحبًا، أنا أقارن بين عقار أو مشروع أو منطقة، وأرغب في المساعدة لتقييم السعر، والموقع، ومدى ملاءمته لأهدافي.'
          },
          {
            label: 'دعم السكني / التمويل',
            body: 'مرحبًا، أود أن أفهم ما إذا كنت قد أكون مؤهلًا لبرنامج دعم السكني أو ما هو خيار التمويل الأنسب لعملية الشراء.'
          },
          {
            label: 'شراكة مع مطور',
            body: 'مرحبًا، أنا أمثل مشروعًا عقاريًا وأرغب في مناقشة التموضع، والتسويق، ودعم المبيعات.'
          },
          {
            label: 'حجز استشارة',
            body: 'مرحبًا، أود حجز استشارة لمناقشة وضعي والخطوات التالية الأكثر ملاءمة.'
          }
        ]
      }
    };
    const copy = contactCopy[locale] || contactCopy.en;
    const profileField = form.querySelector('[name="profile"]');
    const messageField = form.querySelector('[name="message"]');

    const createSelectField = (id, name, label, placeholder, options) => {
      const group = document.createElement('div');
      group.className = 'form-group';
      const labelEl = document.createElement('label');
      labelEl.className = 'form-label';
      labelEl.setAttribute('for', id);
      labelEl.textContent = label;
      const select = document.createElement('select');
      select.id = id;
      select.name = name;
      select.className = 'form-select';
      select.required = true;
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = placeholder;
      select.appendChild(placeholderOption);
      options.forEach((optionText) => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      });
      group.append(labelEl, select);
      return group;
    };

    const setPersistentHidden = (name, value) => {
      let input = form.querySelector(`input[name="${name}"]`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
      input.defaultValue = value;
      return input;
    };

    if (profileField && messageField && !form.querySelector('[data-lead-capture="true"]')) {
      const leadWrap = document.createElement('div');
      leadWrap.className = 'form-grid form-grid-3';
      leadWrap.setAttribute('data-lead-capture', 'true');
      leadWrap.append(
        createSelectField('primary-goal', 'primary_goal', copy.primaryGoal, copy.primaryGoalPlaceholder, copy.goalOptions),
        createSelectField('timeline', 'timeline', copy.timeline, copy.timelinePlaceholder, copy.timelineOptions),
        createSelectField('preferred-contact', 'preferred_contact', copy.preferredContact, copy.preferredContactPlaceholder, copy.contactOptions)
      );
      profileField.closest('.form-group').insertAdjacentElement('afterend', leadWrap);

      const messageGroup = messageField.closest('.form-group');
      if (messageGroup) {
        const prefillWrap = document.createElement('div');
        prefillWrap.className = 'prefill-wrap';

        const prefillLabel = document.createElement('label');
        prefillLabel.className = 'form-label';
        prefillLabel.textContent = copy.prefillLabel;

        const prefillTemplates = document.createElement('div');
        prefillTemplates.className = 'prefill-templates';
        prefillTemplates.setAttribute('role', 'list');

        const prefillNote = document.createElement('p');
        prefillNote.className = 'form-section-note';
        prefillNote.textContent = copy.prefillNote;

        const templateInput = document.createElement('input');
        templateInput.type = 'hidden';
        templateInput.name = 'message_template';
        templateInput.defaultValue = '';
        form.appendChild(templateInput);

        copy.templates.forEach((template, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'prefill-template';
          button.textContent = template.label;
          button.dataset.templateBody = template.body;
          button.dataset.templateLabel = template.label;
          button.setAttribute('role', 'listitem');
          button.addEventListener('click', () => {
            prefillTemplates.querySelectorAll('.prefill-template').forEach((el) => el.classList.remove('is-active'));
            button.classList.add('is-active');
            templateInput.value = template.label;
            messageField.value = template.body;
            messageField.focus();
            if (typeof messageField.setSelectionRange === 'function') {
              const end = messageField.value.length;
              messageField.setSelectionRange(end, end);
            }
          });
          if (index === 0) {
            button.classList.add('is-active');
            templateInput.value = template.label;
            if (!messageField.value.trim()) messageField.value = template.body;
          }
          prefillTemplates.appendChild(button);
        });

        prefillWrap.append(prefillLabel, prefillTemplates, prefillNote);
        messageGroup.insertAdjacentElement('beforebegin', prefillWrap);
      }

      setPersistentHidden('page_url', window.location.href);
      setPersistentHidden('page_title', document.title);
      setPersistentHidden('lead_locale', locale);
      setPersistentHidden('lead_source', 'website_contact_form');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const status = form.querySelector('#form-status');
      const original = btn.textContent;
      const sendingTxt = form.dataset.sending || 'Sending…';
      const successTxt = form.dataset.success || 'Message sent. We will be in touch shortly.';
      const errorTxt = form.dataset.error || 'Something went wrong. Please email contact@RahimInternational.com directly.';
      btn.textContent = sendingTxt;
      btn.disabled = true;
      if (status) { status.textContent = ''; status.className = 'form-status'; }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Failed');
        form.reset();
        if (status) {
          status.textContent = successTxt;
          status.classList.add('is-success');
        }
      } catch {
        if (status) {
          status.textContent = errorTxt;
          status.classList.add('is-error');
        }
      } finally {
        btn.textContent = original;
        btn.disabled = false;
      }
    });
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.faq-item.is-open').forEach(el => el.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  // ---- Mortgage / Daam Sakani Calculator ----
  function getDaamSakaniGrant(price) {
    if (price <= 0) return 0;
    if (price <= 300000) return 100000;
    if (price <= 700000) return 70000;
    return 0;
  }

  document.querySelectorAll('[data-mortgage-calc]').forEach((calc) => {
    const locale = calc.dataset.locale || 'en';
    const localeTag = locale === 'ar' ? 'ar-MA' : (locale === 'fr' ? 'fr-MA' : 'en-US');
    const fmt = new Intl.NumberFormat(localeTag, { maximumFractionDigits: 0 });

    const inputs = {
      price:   calc.querySelector('[data-input="price"]'),
      daam:    calc.querySelector('[data-input="daam"]'),
      downPct: calc.querySelector('[data-input="down-pct"]'),
      term:    calc.querySelector('[data-input="term"]'),
      rate:    calc.querySelector('[data-input="rate"]'),
    };
    const outputs = {
      grant:         calc.querySelector('[data-output="grant"]'),
      downAmount:    calc.querySelector('[data-output="down-amount"]'),
      loan:          calc.querySelector('[data-output="loan"]'),
      monthly:       calc.querySelector('[data-output="monthly"]'),
      totalInterest: calc.querySelector('[data-output="total-interest"]'),
      grantNote:     calc.querySelector('[data-output="grant-note"]'),
    };

    const grantNoteText = {
      en: { tier1: 'Tier 1 — social housing band', tier2: 'Tier 2 — middle market band', none: 'Above the 700,000 MAD ceiling' },
      fr: { tier1: 'Palier 1 — logement social', tier2: 'Palier 2 — gamme intermédiaire', none: 'Au-dessus du plafond de 700 000 MAD' },
      ar: { tier1: 'الشريحة 1 — السكن الاجتماعي', tier2: 'الشريحة 2 — السوق المتوسط', none: 'فوق سقف 700,000 درهم' },
    }[locale] || { tier1: '', tier2: '', none: '' };

    function recalc() {
      const price   = Math.max(0, Number(inputs.price.value) || 0);
      const daamOn  = inputs.daam ? inputs.daam.checked : false;
      const grant   = daamOn ? getDaamSakaniGrant(price) : 0;
      const downPct = Math.min(100, Math.max(0, Number(inputs.downPct.value) || 0));
      const downAmt = Math.round(price * downPct / 100);
      const term    = Math.max(1, Number(inputs.term.value) || 20);
      const rate    = Math.max(0, Number(inputs.rate.value) || 0) / 100;

      const loan = Math.max(0, price - grant - downAmt);
      const months = term * 12;
      const monthlyRate = rate / 12;
      let monthly = 0;
      if (loan > 0 && months > 0) {
        monthly = monthlyRate === 0
          ? loan / months
          : (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      }
      const totalCost = monthly * months;
      const totalInterest = totalCost - loan;

      if (outputs.grant)         outputs.grant.textContent         = fmt.format(grant);
      if (outputs.downAmount)    outputs.downAmount.textContent    = fmt.format(downAmt);
      if (outputs.loan)          outputs.loan.textContent          = fmt.format(loan);
      if (outputs.monthly)       outputs.monthly.textContent       = fmt.format(Math.round(monthly));
      if (outputs.totalInterest) outputs.totalInterest.textContent = fmt.format(Math.round(totalInterest));
      if (outputs.grantNote) {
        if (!daamOn) outputs.grantNote.textContent = '';
        else if (price <= 300000) outputs.grantNote.textContent = grantNoteText.tier1;
        else if (price <= 700000) outputs.grantNote.textContent = grantNoteText.tier2;
        else outputs.grantNote.textContent = grantNoteText.none;
      }
    }

    Object.values(inputs).forEach((el) => {
      if (!el) return;
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });
    recalc();
  });

})();
