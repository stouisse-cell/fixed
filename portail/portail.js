/* ============================================================
   RAHIM INTERNATIONAL — ESPACE CLIENT : configuration et données
   ------------------------------------------------------------
   1. Renseignez SUPABASE_URL et SUPABASE_ANON_KEY ci-dessous
      (Supabase → Project Settings → API). La clé « anon » est
      publique par conception : la sécurité repose sur les règles
      RLS définies dans schema.sql.
   2. Tant que ces valeurs sont vides, ou avec ?demo=1 dans l'URL,
      le portail fonctionne en mode démonstration (données fictives).
   ⚠ Ce dépôt est public : n'y mettez jamais de données clients.
   ============================================================ */
window.RI_CONFIG = {
  SUPABASE_URL: 'https://djaverrqyhemgyypuvbw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqYXZlcnJxeWhlbWd5eXB1dmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3OTQ3MzEsImV4cCI6MjEwODM3MDczMX0.bcNmZ7PIoqb78z3WZNKbZAQSRwXBCm3T9EVG1N1cUhU',
  BUCKET: 'documents',
  WHATSAPP: '212642773249',
  EMAIL: 'contact@rahiminternational.com',
};

(function () {
  const cfg = window.RI_CONFIG;
  const params = new URLSearchParams(location.search);
  const DEMO = params.get('demo') === '1' || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY;

  // ---------- étapes par formule ----------
  const STEPS = {
    standard: [
      ['Consultation découverte', 'Nous faisons connaissance et définissons votre projet.'],
      ['Plan d’Acquisition et 1ère visite', 'Échange sur votre stratégie et préparation de la première recherche.'],
      ['Visites et comptes rendus', 'Visites filmées et comptes rendus sous 72 heures ouvrables.'],
      ['Comparatif et choix du bien', 'Les meilleures options côte à côte, présentées par appel vidéo.'],
      ['Négociation et compromis', 'Offre validée par vous, relecture du compromis, financement.'],
      ['Acte et remise des clés', 'Signature chez le notaire et remise de votre Dossier Propriétaire.'],
    ],
    vefa: [
      ['Consultation découverte', 'Nous faisons connaissance et définissons votre projet.'],
      ['Plan d’Acquisition et 1ère visite', 'Échange sur votre stratégie et préparation de la première recherche.'],
      ['Visites de projets', 'Projets visités et filmés, promoteurs vérifiés.'],
      ['Comparatif et choix du logement', 'Comparaison des projets et choix du logement.'],
      ['Contrat de réservation', 'Négociation, relecture du contrat et réservation.'],
    ],
    essentiel: [
      ['Consultation découverte', 'Nous faisons connaissance et définissons votre projet.'],
      ['Plan d’Acquisition', 'Présentation de votre Plan et d’une première recherche ciblée.'],
      ['Sélections et Fiches Découverte', 'Des opportunités correspondant à votre profil, avec visite vidéo sur demande.'],
      ['Choix du bien et inspection', 'Inspection visuelle du bien choisi et points de vigilance.'],
      ['Offre et financement', 'Nos conseils avant l’offre, le financement et le compromis.'],
      ['Acte et Dossier Propriétaire', 'Nos conseils pour la signature et la remise de votre Dossier Propriétaire.'],
    ],
    vefa_suivi: [
      ['Contrat de réservation', 'Relecture du contrat, de l’échéancier et de la date de livraison.'],
      ['Suivi du chantier', 'Visites régulières du chantier, avec photos et compte rendu.'],
      ['Appels de fonds', 'Vérification de chaque appel de fonds par rapport à l’avancement réel.'],
      ['Inspection du gros œuvre', 'Photos et contrôle de la structure.'],
      ['Livraison et réserves', 'Contrôle du logement à la livraison et suivi des réserves.'],
      ['Remise des clés', 'Votre Carnet du logement, votre Dossier Propriétaire et notre aide après les clés.'],
    ],
  };
  // clés enregistrées dans clients.formule (les noms suivent la brochure)
  const FORMULES = {
    essentiel: { label: 'Accompagnement Essentiel', steps: 'essentiel' },
    complet: { label: 'Accompagnement Complet', steps: 'standard' },
    premium: { label: 'Premium', steps: 'standard' },
    vefa: { label: 'VEFA Recherche Complet', steps: 'vefa' },
    vefa_suivi: { label: 'VEFA Suivi Complet', steps: 'vefa_suivi' },
  };
  const CATEGORIES = {
    plan: 'Plan d’Acquisition',
    compte_rendu: 'Comptes rendus de visite',
    video: 'Vidéos des visites',
    comparatif: 'Comparatif des biens',
    negociation: 'Stratégie de négociation',
    contrat: 'Contrats',
    dossier: 'Dossier Propriétaire',
    autre: 'Autres documents',
    piece_client: 'Pièces déposées par le client',
    financement: 'Financement',
  };
  const FIN_STAGES = [
    ['Simulation et capacité d’emprunt', 'Votre budget, votre apport et la mensualité visée.'],
    ['Dossier de crédit constitué', 'Vos pièces réunies et vérifiées.'],
    ['Dossier déposé à la banque', 'La banque étudie votre demande.'],
    ['Accord de principe', 'La banque confirme qu’elle peut vous financer.'],
    ['Offre de prêt reçue', 'Conditions définitives : montant, taux, durée, assurance.'],
    ['Prêt signé', 'Signature chez le notaire, le jour de l’acte.'],
  ];
  const DAAM = { na: 'Non applicable', eligible: 'Éligible, à demander', demande: 'Demande déposée', accorde: 'Accordée', refuse: 'Non retenue' };
  // documents « vivants » : une page chacun, avec versions successives
  const DOC_TYPES = [
    { k: 'plan', label: 'Plan d’Acquisition', desc: 'Votre stratégie : budget réel, quartiers, critères et calendrier.', when: 'Remis avant la consultation découverte, puis ajusté ensemble et mis à jour si votre projet évolue.', hideEmptyFor: ['vefa_suivi'] },
    { k: 'comparatif', label: 'Comparatif', desc: 'Les meilleurs biens côte à côte, notés, avec notre recommandation.', when: 'Après les premières visites, puis mis à jour au fil des nouvelles visites.', hideEmptyFor: ['essentiel', 'vefa_suivi'] },
    { k: 'negociation', label: 'Négociation', desc: 'Le juste prix, nos arguments et votre plafond, validés par vous.', when: 'Une fois le bien choisi.', only: ['premium', 'vefa', 'vefa_suivi'], hideEmptyFor: ['vefa_suivi'] },
    { k: 'contrat', label: 'Contrats', desc: 'Votre engagement, votre contrat d’accompagnement et les documents signés.', when: 'Dès la signature.' },
    { k: 'dossier', label: 'Dossier Propriétaire', desc: 'Tous les documents essentiels de votre achat, réunis au même endroit.', when: 'À la remise des clés.' },
    { k: 'autre', label: 'Autres', desc: 'Autres documents partagés par votre conseiller.', hideEmpty: true },
  ];
  // hideEmptyFor : onglet masqué au client tant qu’il est vide (documents gardés après un changement de formule)
  const typesFor = f => DOC_TYPES.filter(t => !t.only || t.only.includes(f)).map(t => t.hideEmptyFor && t.hideEmptyFor.includes(f) ? { ...t, hideEmpty: true } : t);
  const PIECES = [
    ['identite', 'Pièce d’identité', 'Passeport ou CIN, recto et verso'],
    ['residence', 'Justificatif de résidence à l’étranger', 'Facture, bail ou titre de séjour récent'],
    ['salaire', 'Bulletins de salaire', 'Les 3 derniers'],
    ['impots', 'Avis d’imposition', 'Le dernier reçu'],
    ['releves', 'Relevés bancaires', 'Les 6 derniers mois'],
    ['apport', 'Justificatif de l’apport', 'Relevé d’épargne ou attestation'],
  ];
  const MODES = {
    sur_place: 'Visite sur place en présence du client',
    proche: 'Visite sur place par un proche ou un mandataire',
    distance: 'Présentation à distance (visite filmée, appel vidéo, photos)',
    informations: 'Envoi d’informations (fiche, adresse, plans, coordonnées)',
  };
  const visitNo = v => 'BV-' + String(v.num || 0).padStart(4, '0');
  // feuille de route : ce que vous faites / ce que vous recevez, et les documents rattachés à chaque étape
  const ROADMAP = {
    standard: [
      { you: 'Remplir le questionnaire et signer votre engagement de non-contournement.', get: 'Un échange pour comprendre votre projet.', cats: [] },
      { you: 'Valider votre Plan, tel quel ou ajusté, puis signer votre contrat.', get: 'Votre Plan d’Acquisition Personnalisé et votre 1er compte rendu de visite.', cats: ['plan', 'contrat'] },
      { you: 'Confirmer chaque bon de visite et nous donner vos retours.', get: 'Un compte rendu sous 72 heures ouvrables et la vidéo de chaque visite.', cats: [], visits: true },
      { you: 'Choisir votre bien lors de l’appel vidéo.', get: 'Le Comparatif des meilleurs biens et notre recommandation.', cats: ['comparatif'] },
      { you: 'Valider l’offre et votre plafond, déposer vos pièces pour le crédit.', get: 'La stratégie de négociation et la relecture du compromis.', cats: ['negociation', 'financement'] },
      { you: 'Signer chez le notaire, sur place ou par procuration.', get: 'Votre Dossier Propriétaire et les clés.', cats: ['dossier'] },
    ],
    vefa: [
      { you: 'Remplir le questionnaire et signer votre engagement de non-contournement.', get: 'Un échange pour comprendre votre projet.', cats: [] },
      { you: 'Valider votre Plan, tel quel ou ajusté, puis signer votre contrat.', get: 'Votre Plan d’Acquisition Personnalisé et votre 1er compte rendu de visite.', cats: ['plan', 'contrat'] },
      { you: 'Confirmer chaque bon de visite et nous donner vos retours.', get: 'Le compte rendu et la vidéo de chaque projet visité.', cats: [], visits: true },
      { you: 'Choisir votre projet et votre logement.', get: 'Le Comparatif des projets et notre recommandation.', cats: ['comparatif'] },
      { you: 'Valider les conditions et signer le contrat de réservation.', get: 'La négociation (prix, logement, échéancier) et la relecture du contrat.', cats: ['negociation', 'financement'] },
    ],
    essentiel: [
      { you: 'Remplir le questionnaire et signer votre engagement de non-contournement.', get: 'Un échange pour comprendre votre projet.', cats: [] },
      { you: 'Valider votre Plan, tel quel ou ajusté, puis signer votre contrat.', get: 'Votre Plan d’Acquisition Personnalisé et une première recherche ciblée.', cats: ['plan', 'contrat'] },
      { you: 'Nous dire quels biens vous intéressent et confirmer chaque bon de visite.', get: 'Chaque mois, des opportunités correspondant à votre profil, avec leur Fiche Découverte.', cats: [], visits: true },
      { you: 'Choisir votre bien.', get: 'Une inspection visuelle du bien et les points de vigilance relevés.', cats: [] },
      { you: 'Faire votre offre et préparer votre financement.', get: 'Nos conseils avant l’offre, le financement et le compromis.', cats: ['financement'] },
      { you: 'Signer chez le notaire, sur place ou par procuration.', get: 'Votre Dossier Propriétaire.', cats: ['dossier'] },
    ],
    vefa_suivi: [
      { you: 'Nous transmettre votre contrat de réservation et signer votre contrat de suivi.', get: 'La relecture du contrat et de l’échéancier, et la date de référence de livraison.', cats: ['contrat'] },
      { you: 'Suivre l’avancement depuis votre espace.', get: 'Des photos et un compte rendu à chaque visite du chantier.', cats: [] },
      { you: 'Nous transmettre chaque appel de fonds avant de payer.', get: 'Notre vérification de l’appel de fonds par rapport à l’avancement.', cats: ['financement'] },
      { you: 'Prendre connaissance de l’inspection.', get: 'Les photos et nos observations sur le gros œuvre.', cats: [] },
      { you: 'Assister à la livraison, sur place ou à distance.', get: 'Le contrôle du logement et la liste des réserves.', cats: [] },
      { you: 'Récupérer vos clés.', get: 'Votre Carnet du logement, votre Dossier Propriétaire et notre aide après les clés.', cats: ['dossier'] },
    ],
  };
  // Metadata lives in the existing step_dates JSON: no database migration required.
  const workflowFor = c => (c && c.step_dates && c.step_dates._workflow) || {};
  const isNewWorkflow = () => true;
  const visitWaived = c => workflowFor(c).bon_visite === 'waived';
  const INTRO_STEPS = [
    ['Brochure reçue', 'Nos formules et nos honoraires vous ont été transmis.'],
    ['Questionnaire de préconsultation rempli', 'Vous nous avez présenté votre projet et vos priorités.'],
    ['Analyse et Plan d’Acquisition Personnalisé remis', 'Votre analyse et votre stratégie sont disponibles avant notre échange.'],
    ['Consultation découverte', 'Nous discutons de votre stratégie, des formules et des ajustements à apporter au plan.'],
    ['Première recherche et visite sur mesure offertes', 'Une première sélection, une visite et les éléments pour comparer, sans obligation de poursuivre.'],
    ['Choix de la suite', 'Rester en Essentiel, passer au Complet ou au Premium, ou arrêter après la première recherche.'],
  ];
  const INTRO_ROAD = [
    { you: 'Prendre connaissance de la brochure.', get: 'Nos formules et nos honoraires.', cats: [] },
    { you: 'Compléter le questionnaire de préconsultation.', get: 'Une analyse fondée sur vos réponses.', cats: [] },
    { you: 'Lire votre analyse et noter vos questions.', get: 'Votre analyse et votre Plan d’Acquisition Personnalisé.', cats: ['plan'] },
    { you: 'Discuter de vos priorités, de la stratégie et des formules avec votre conseiller.', get: 'Des réponses à vos questions et un plan ajusté si nécessaire.', cats: ['plan', 'contrat'], requirement: 'non_contournement' },
    { you: 'Nous donner vos retours sur la première sélection et la visite.', get: 'Une première recherche et visite sur mesure offertes, avec compte rendu, photos et vidéos.', cats: [], visits: true, requirement: 'bon_visite' },
    { you: 'Choisir librement de poursuivre en Essentiel, de passer au Complet/Premium ou de vous arrêter.', get: 'Une explication claire de la suite et des honoraires applicables.', cats: ['contrat'] },
  ];
  const roadmapFor = c => {
    const f = typeof c === 'string' ? c : c.formule;
    const key = (FORMULES[f] || FORMULES.essentiel).steps;
    const result = INTRO_ROAD.concat(key === 'vefa_suivi' ? ROADMAP[key] : ROADMAP[key].slice(2)).map(r => ({ ...r }));
    if (workflowFor(c).arrangement === 'offert') {
      result[5].you = 'Confirmer avec votre conseiller la suite de votre accompagnement offert.';
      result[5].get = 'Les modalités de la suite, sans changement automatique de formule ni facturation.';
    }
    if (visitWaived(c)) result.forEach(r => { if (r.visits) r.you = r.you.replace('Confirmer chaque bon de visite et ', '').replace(' et confirmer chaque bon de visite', ''); });
    return result;
  };
  const requirementText = (c, key) => {
    const title = key === 'bon_visite' ? 'Bon de visite' : 'Engagement de non-contournement';
    const status = workflowFor(c)[key] || 'pending';
    return title + ' : ' + (status === 'waived' ? 'non requis pour votre accompagnement' : status === 'signed' ? 'signature enregistrée' : key === 'bon_visite' ? 'à confirmer avant la visite' : 'à signer lors de la consultation découverte');
  };
  // Équipe du client : conseiller (signe le mot du conseiller) et agent sur le terrain (facultatif).
  // Équipe par défaut de chaque client ; une équipe enregistrée dans la fiche client la remplace.
  const DEFAULT_ADVISOR = { name: 'Shireen Touisse', role: 'Consultante en études et stratégie immobilière', whatsapp: '+1 780 904 7129' };
  const DEFAULT_AGENT = { name: 'Ali Rahim', role: 'Fondateur · Consultant en acquisitions et opérations immobilières', whatsapp: '+212 6 42 77 32 49' };
  const teamFor = c => {
    const t = c && c.team;
    if (!t) return { advisor: DEFAULT_ADVISOR, agent: DEFAULT_AGENT };
    const clean = p => p && p.name ? { name: p.name, role: p.role || '', whatsapp: p.whatsapp || '' } : null;
    return { advisor: clean(t.advisor) || DEFAULT_ADVISOR, agent: clean(t.agent) };
  };
  const waDigits = n => String(n || '').replace(/\D/g, '');
  const initials = n => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const stepsFor = c => {
    const f = typeof c === 'string' ? c : c.formule;
    const key = (FORMULES[f] || FORMULES.essentiel).steps;
    const result = INTRO_STEPS.concat(key === 'vefa_suivi' ? STEPS[key] : STEPS[key].slice(2));
    if (workflowFor(c).arrangement === 'offert') result[5] = ['Suite de l’accompagnement offert', 'Confirmer ensemble les prochaines étapes de votre accompagnement offert.'];
    return result;
  };

  // Present every file using one roadmap. Persist the conversion on the next admin save.
  // Ambiguous early progress is left pending; its original values remain available for audit.
  const normalizeClient = c => {
    if (!c || workflowFor(c).version === 4) return c;
    if (workflowFor(c).version === 3) {
      const previous = c.step_dates || {};
      const archived = workflowFor(c).before_choice_removal;
      const dates = {};
      Object.entries(previous).forEach(([key, value]) => {
        const n = Number(key);
        if (Number.isInteger(n) && n > 0) dates[n >= 6 ? n + 1 : n] = value;
      });
      // Restore the removed milestone date when it was recorded.
      if (archived && archived.step_dates && archived.step_dates[6]) dates[6] = archived.step_dates[6];
      const step = Number(c.current_step) || 1;
      // A client who was on the removed milestone remains on it after restoration.
      const wasOnChoice = step === 6 && archived && archived.current_step === 6;
      dates._workflow = { ...workflowFor(c), version: 4 };
      return { ...c, current_step: step >= 6 && !wasOnChoice ? step + 1 : step, step_dates: dates };
    }
    if (workflowFor(c).version === 2) {
      return { ...c, step_dates: { ...(c.step_dates || {}), _workflow: { ...workflowFor(c), version: 4 } } };
    }
    const oldStep = Number(c.current_step) || 1;
    const previous = c.step_dates || {};
    const followUp = c.formule === 'vefa_suivi';
    const current = followUp ? 1 : oldStep <= 2 ? (oldStep === 1 ? 1 : 3) : oldStep + 4;
    const dates = {};
    if (!followUp) Object.entries(previous).forEach(([key, value]) => {
      const n = Number(key);
      if (Number.isInteger(n) && n > 0) dates[n <= 2 ? n + 3 : n + 4] = value;
    });
    dates._workflow = { ...workflowFor(c), version: 2, progress_needs_review: followUp || oldStep <= 2,
      previous_progress: { current_step: c.current_step, step_dates: previous } };
    return normalizeClient({ ...c, current_step: current, step_dates: dates });
  };

  // ---------- mode démonstration ----------
  const demoRequests = [
    { id: 'req-1', created_at: '2026-10-30T09:12:00Z', lang: 'en', full_name: 'Youssef Amrani', email: 'y.amrani@exemple.com', whatsapp: '+33 6 12 34 56 78', preferred_contact: 'WhatsApp', category: 'Appartement',
      brochure: 'Brochure Accompagnement A–Z (Clients MRE)', status: 'nouvelle', client_id: null, links: null, notes: 'Disponible pour un appel le soir, heure de Paris.',
      raw: { villes: ['Kénitra'] }, answers: [{ q: 'Votre projet · Quel est votre projet ?', a: 'Habiter et investir' }, { q: 'Budget · Quel est votre budget maximum ?', a: '900 000 à 1 200 000 DH' }, { q: 'Villes · Dans quelle(s) ville(s) ?', a: 'Kénitra' }, { q: 'Calendrier · Quand souhaitez-vous acheter ?', a: 'Dans les 6 mois' }] },
  ];
  const daysAgo = n => new Date(Date.now() - n * 864e5).toISOString();
  const demoBrochures = [
    { id: 'bro-1', created_at: daysAgo(4), lang: 'fr', page: '/fr/investors-mre.html', first_name: 'Nadia', email: 'nadia.b@exemple.com', whatsapp: '+32 470 12 34 56', profile: 'mre', timeframe: '3to12m', cities: ['Kénitra'], property_types: ['Appartement'], email_sent: true, status: 'new', call_requested_at: null, reminder_sent_at: null },
    { id: 'bro-2', created_at: daysAgo(1), lang: 'en', page: '/', first_name: 'Tom', email: 'tom@example.com', whatsapp: null, profile: 'international', timeframe: 'info', cities: [], property_types: ['Villa'], email_sent: false, status: 'new', call_requested_at: null, reminder_sent_at: null },
  ];
  const demoClients = [
    { id: 'demo-1', email: 'famille.alaoui@exemple.com', full_name: 'Famille Alaoui', formule: 'premium', city: 'Kénitra', current_step: 3, financing: 'credit', fin: { bank: 'Saham Bank', amount: 600000, years: 20, rate: 4.6, stage: 3, daam: 'na', note: 'Dossier déposé le 22 octobre. Réponse de principe attendue sous 10 jours ouvrables.' },
      step_dates: { 1: '2026-09-28', 2: '2026-10-09', 3: '2026-10-21' },
      message: 'Bonjour ! Les comptes rendus des visites 2 et 3 sont en ligne. L’appartement de Maamora est notre coup de cœur : nous en parlons lors de l’appel vidéo du 28 octobre.',
      message_date: '2026-10-21', created_at: '2026-09-28' },
    { id: 'demo-2', email: 'k.bennani@exemple.com', full_name: 'Karim Bennani', formule: 'vefa', city: 'Kénitra', current_step: 2,
      step_dates: { 1: '2026-10-14' }, message: '', message_date: null, created_at: '2026-10-14' },
  ];
  const demoDocs = [
    { id: 'd1', client_id: 'demo-1', title: 'Plan d’Acquisition Personnalisé', category: 'plan', created_at: '2026-10-09', url: '#' },
    { id: 'd1b', client_id: 'demo-1', title: 'Plan d’Acquisition Personnalisé', category: 'plan', note: 'Budget ajusté à 1 200 000 DH et quartier Maamora ajouté après notre appel du 18 octobre.', created_at: '2026-10-19', url: '#' },
    { id: 'd2', client_id: 'demo-1', title: 'Compte rendu · Visite 1 · Bir Rami', category: 'compte_rendu', visit_id: 'v0', created_at: '2026-10-09', url: '#' },
    { id: 'd3', client_id: 'demo-1', title: 'Compte rendu · Visite 2 · Maamora', category: 'compte_rendu', visit_id: 'v1', created_at: '2026-10-20', url: '#' },
    { id: 'd4', client_id: 'demo-1', title: 'Compte rendu · Visite 3 · Centre-ville', category: 'compte_rendu', created_at: '2026-10-21', url: '#' },
    { id: 'd5', client_id: 'demo-1', title: 'Vidéo · Visite 2 · Maamora', category: 'video', visit_id: 'v1', created_at: '2026-10-20', url: '#' },
    { id: 'd6', client_id: 'demo-1', title: 'Contrat d’accompagnement signé', category: 'contrat', created_at: '2026-10-09', url: '#' },
    { id: 'd7', client_id: 'demo-1', title: 'Bon de visite n° 014', category: 'contrat', created_at: '2026-10-20', url: '#' },
    { id: 'd8', client_id: 'demo-1', title: 'Simulation de crédit · Saham Bank', category: 'financement', created_at: '2026-10-15', url: '#' },
  ];

  const demoVisits = [
    { id: 'v1', num: 14, client_id: 'demo-1', visit_date: '2026-10-20', mode: 'distance', visitor_name: null, status: 'pending',
      properties: [{ address: 'Résidence Al Andalous, Mimosas', type: '3 pièces, 92 m²', price: '1 176 000 DH' }, { address: 'Avenue Mohammed V, Val Fleuri', type: '3 pièces, 104 m²', price: '1 050 000 DH' }],
      declaration: '1. Présentation par Rahim International. Je reconnais que les biens listés ci-dessus m’ont été présentés par Rahim International.\n2. Présentation à distance. La communication d’informations permettant d’identifier un bien vaut présentation.\n3. Non-contournement. Pendant 24 mois, je m’engage à ne pas acheter ce bien sans passer par Rahim International.\n4. Rémunération. Celle prévue au contrat que j’ai signé.\n5. Confidentialité. Les informations communiquées sont strictement personnelles.', created_at: '2026-10-20' },
    { id: 'v0', num: 9, client_id: 'demo-1', visit_date: '2026-10-09', mode: 'sur_place', status: 'confirmed', confirmed_at: '2026-10-09T17:42:00Z', confirmed_name: 'Karim Alaoui', confirmed_email: 'famille.alaoui@exemple.com',
      properties: [{ address: 'Rue Abdelmoumen, Bir Rami', type: '3 pièces, 88 m²', price: '980 000 DH' }], declaration: '…', created_at: '2026-10-09' },
  ];
  let sb = null;
  function loadSupabase() {
    return new Promise((res, rej) => {
      if (window.supabase) return res();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
      s.onload = res; s.onerror = () => rej(new Error('Impossible de charger Supabase'));
      document.head.appendChild(s);
    });
  }
  async function client() {
    if (sb) return sb;
    await loadSupabase();
    sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    return sb;
  }
  const uid = () => 'x' + Math.random().toString(36).slice(2, 10);
  const today = () => new Date().toISOString().slice(0, 10);

  const API = {
    DEMO,
    async session() {
      if (DEMO) return { email: params.get('as') || 'demo' };
      const c = await client();
      const { data } = await c.auth.getSession();
      if (!data.session) return null;
      const m = data.session.user.user_metadata || {};
      return { email: data.session.user.email, must_change: !!m.must_change, has_password: !!m.has_password };
    },
    async signInPassword(email, password) {
      if (DEMO) return;
      const c = await client();
      const { error } = await c.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) throw new Error(/invalid/i.test(error.message) ? 'Courriel ou mot de passe incorrect.' : error.message);
    },
    async updatePassword(password) {
      if (DEMO) return;
      const c = await client();
      const { error } = await c.auth.updateUser({ password, data: { must_change: false, has_password: true } });
      if (error) throw new Error(/different from the old/i.test(error.message) ? 'Choisissez un mot de passe différent du mot de passe provisoire.' : error.message);
    },
    async setClientPassword(clientId, password) {
      if (DEMO) return { ok: true };
      const c = await client();
      const { data, error } = await c.functions.invoke('account', { body: { action: 'set_password', client_id: clientId, password } });
      if (error) { let d = ''; try { d = (await error.context.json()).error; } catch (e) {} throw new Error(d || error.message); }
      return data;
    },
    async sendLink(email, redirect) {
      if (DEMO) return;
      const c = await client();
      const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: false } });
      // Only existing accounts get a link; unknown emails get the same neutral reply.
      if (error && !/signups? not allowed|otp_disabled|user not found/i.test(error.message || '')) throw error;
    },
    async signOut() {
      if (DEMO) { location.href = location.pathname; return; }
      const c = await client(); await c.auth.signOut(); location.reload();
    },
    async isAdmin() {
      if (DEMO) return true;
      const c = await client();
      const { data, error } = await c.from('admins').select('email').limit(1);
      return !error && data.length > 0;
    },
    // ---- client ----
    async myClient() {
      if (DEMO) return normalizeClient(demoClients[0]);
      const c = await client();
      const { data, error } = await c.from('clients').select('*').limit(1);
      if (error) throw error;
      return normalizeClient(data[0] || null);
    },
    async getClient(id) {
      if (DEMO) return normalizeClient(demoClients.find(c => c.id === id) || null);
      const c = await client();
      const { data, error } = await c.from('clients').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return normalizeClient(data);
    },
    async listDocs(clientId) {
      if (DEMO) return demoDocs.filter(d => d.client_id === clientId).sort((a, b) => b.created_at.localeCompare(a.created_at));
      const c = await client();
      const { data, error } = await c.from('documents').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async openDoc(doc) {
      if (DEMO) { toast('Mode démonstration : document fictif'); return; }
      if (doc.url) { window.open(doc.url, '_blank', 'noopener'); return; }
      const c = await client();
      const { data, error } = await c.storage.from(cfg.BUCKET).createSignedUrl(doc.storage_path, 300);
      if (error) throw error;
      window.open(data.signedUrl, '_blank', 'noopener');
    },
    async mediaUrl(doc) {
      if (DEMO) return null;
      if (doc.url) return doc.url;
      const c = await client();
      const { data, error } = await c.storage.from(cfg.BUCKET).createSignedUrl(doc.storage_path, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
    // ---- questionnaires de préconsultation ----
    async listRequests() {
      if (DEMO) return [...demoRequests];
      const c = await client();
      const { data, error } = await c.from('preconsultations').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return data;
    },
    async updateRequest(id, patch) {
      if (DEMO) { const r = demoRequests.find(x => x.id === id); Object.assign(r, patch); return r; }
      const c = await client();
      const { data, error } = await c.from('preconsultations').update(patch).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    // ---- demandes de brochure (formulaire du site) ----
    async listBrochures() {
      if (DEMO) return [...demoBrochures];
      const c = await client();
      const { data, error } = await c.from('brochure_requests').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return data;
    },
    async updateBrochure(id, patch) {
      if (DEMO) { const r = demoBrochures.find(x => x.id === id); Object.assign(r, patch); return r; }
      const c = await client();
      const { data, error } = await c.from('brochure_requests').update(patch).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    // rappel du questionnaire, envoyé par la fonction brochure-request (vérifie que l’on est admin)
    async sendBrochureReminder(id) {
      if (DEMO) { const r = demoBrochures.find(x => x.id === id); r.reminder_sent_at = new Date().toISOString(); return r; }
      const c = await client();
      const { data, error } = await c.functions.invoke('brochure-request', { body: { action: 'reminder', id } });
      if (error) { let d = ''; try { d = (await error.context.json()).error; } catch (e) {} throw new Error(d === 'seller' ? 'Pas de rappel pour un vendeur.' : d || error.message); }
      return data;
    },
    // ---- admin ----
    async listClients() {
      if (DEMO) return demoClients.map(normalizeClient);
      const c = await client();
      const { data, error } = await c.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(normalizeClient);
    },
    async saveClient(row) {
      row = { ...row }; if (row.email !== undefined) row.email = String(row.email).trim().toLowerCase();
      if (DEMO) {
        if (!row.id) { row = { id: uid(), current_step: 1, step_dates: {}, created_at: today(), message: '', ...row }; demoClients.unshift(row); return row; }
        const i = demoClients.findIndex(x => x.id === row.id); demoClients[i] = { ...demoClients[i], ...row }; return demoClients[i];
      }
      const c = await client();
      if (!row.id) {
        delete row.id;
        const { data, error } = await c.from('clients').insert({ current_step: 1, step_dates: {}, ...row }).select().single();
        if (error) throw error; return data;
      }
      const { id, created_at, ...rest } = row;
      const { data, error } = await c.from('clients').update(rest).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    async deleteClient(id) {
      if (DEMO) { const i = demoClients.findIndex(x => x.id === id); demoClients.splice(i, 1); return; }
      const c = await client();
      const docs = await API.listDocs(id);
      const paths = docs.filter(d => d.storage_path).map(d => d.storage_path);
      if (paths.length) await c.storage.from(cfg.BUCKET).remove(paths);
      const { error } = await c.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    async addDoc(clientId, { title, category, file, url, visit_id, note }) {
      if (DEMO) { const d = { id: uid(), client_id: clientId, title, category, note: note || null, visit_id: visit_id || null, url: url || '#', created_at: today() }; demoDocs.unshift(d); return d; }
      const c = await client();
      let storage_path = null;
      if (file) {
        const safe = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
        storage_path = `${clientId}/${Date.now()}-${safe}`;
        const { error } = await c.storage.from(cfg.BUCKET).upload(storage_path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
      }
      const { data, error } = await c.from('documents').insert({ client_id: clientId, title, category, storage_path, url: url || null, visit_id: visit_id || null, note: note || null }).select().single();
      if (error) throw error; return data;
    },
    async uploadPiece(clientId, docType, file) {
      const label = (PIECES.find(p => p[0] === docType) || [, 'Autre document'])[1];
      if (DEMO) { const d = { id: uid(), client_id: clientId, title: label, category: 'piece_client', doc_type: docType, uploaded_by: 'client', file_name: file.name, url: '#', created_at: today() }; demoDocs.unshift(d); return d; }
      const c = await client();
      const safe = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
      const storage_path = `${clientId}/client/${Date.now()}-${safe}`;
      const up = await c.storage.from(cfg.BUCKET).upload(storage_path, file, { upsert: false, contentType: file.type || undefined });
      if (up.error) throw up.error;
      const { data, error } = await c.from('documents').insert({ client_id: clientId, title: label + ' · ' + file.name, category: 'piece_client', doc_type: docType, uploaded_by: 'client', storage_path }).select().single();
      if (error) { await c.storage.from(cfg.BUCKET).remove([storage_path]); throw error; }
      return data;
    },
    async notify(payload) {
      if (DEMO) return { sent: true, demo: true };
      const c = await client();
      const { data, error } = await c.functions.invoke('notify', { body: payload });
      if (error) {
        let detail = '';
        try { detail = (await error.context.json()).error; } catch (e) {}
        if (detail === 'email_not_configured') throw new Error('Les notifications par courriel ne sont pas encore activées.');
        throw new Error(detail || error.message);
      }
      return data;
    },
    async listVisits(clientId) {
      if (DEMO) return demoVisits.filter(v => v.client_id === clientId).sort((a, b) => b.num - a.num);
      const c = await client();
      const { data, error } = await c.from('visits').select('*').eq('client_id', clientId).order('num', { ascending: false });
      if (error) throw error; return data;
    },
    async getVisit(id) {
      if (DEMO) return demoVisits.find(v => v.id === id) || null;
      const c = await client();
      const { data, error } = await c.from('visits').select('*').eq('id', id).maybeSingle();
      if (error) throw error; return data;
    },
    async createVisit(row) {
      if (DEMO) { const v = { id: uid(), num: 15 + demoVisits.length, status: 'pending', declaration: demoVisits[0].declaration, created_at: today(), ...row }; demoVisits.unshift(v); return v; }
      const c = await client();
      const { data, error } = await c.from('visits').insert(row).select().single();
      if (error) throw error; return data;
    },
    async deleteVisit(id) {
      if (DEMO) { demoVisits.splice(demoVisits.findIndex(v => v.id === id), 1); return; }
      const c = await client();
      const { error } = await c.from('visits').delete().eq('id', id).eq('status', 'pending');
      if (error) throw error;
    },
    async lockedReports() {
      if (DEMO) return demoDocs.filter(d => demoVisits.some(v => v.id === d.visit_id && v.status === 'pending')).map(d => ({ visit_id: d.visit_id, title: d.title, category: d.category }));
      const c = await client();
      const { data, error } = await c.rpc('locked_reports');
      if (error) throw error; return data || [];
    },
    async confirmVisit(id, name) {
      if (DEMO) { const v = demoVisits.find(x => x.id === id); Object.assign(v, { status: 'confirmed', confirmed_at: new Date().toISOString(), confirmed_name: name, confirmed_email: 'demo' }); return v; }
      const c = await client();
      const { data, error } = await c.rpc('confirm_visit', { p_visit: id, p_name: name });
      if (error) throw error; return data;
    },
    async deleteDoc(doc) {
      if (DEMO) { const i = demoDocs.findIndex(x => x.id === doc.id); demoDocs.splice(i, 1); return; }
      const c = await client();
      if (doc.storage_path) await c.storage.from(cfg.BUCKET).remove([doc.storage_path]);
      const { error } = await c.from('documents').delete().eq('id', doc.id);
      if (error) throw error;
    },
  };

  // ---------- utilitaires ----------
  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function fmtDate(d) {
    if (!d) return '';
    const x = new Date(String(d).slice(0, 10) + 'T12:00:00');
    return x.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function fmtDateTime(d) {
    if (!d) return '';
    return new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  }
  function propsTable(v) {
    const rows = (v.properties || []).map((p, i) => '<tr><td>' + (i + 1) + '</td><td>' + esc(p.address) + '</td><td>' + esc(p.type) + '</td><td>' + esc(p.price) + '</td></tr>').join('');
    return '<table class="ptable"><thead><tr><th>N°</th><th>Adresse, projet ou référence</th><th>Type et surface</th><th>Prix annoncé</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4" class="muted">Aucun bien</td></tr>') + '</tbody></table>';
  }
  function youtubeId(u) {
    const m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function genPassword() {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const r = crypto.getRandomValues(new Uint32Array(10));
    return 'RI-' + Array.from(r, x => a[x % a.length]).join('');
  }
  // fenêtre « Créer / changer mon mot de passe »
  function passwordModal({ force = false } = {}) {
    return new Promise(resolve => {
      const w = document.createElement('div');
      w.className = 'modal-wrap';
      w.innerHTML = `<div class="card modal" role="dialog" aria-modal="true">
        <div class="eyebrow">Votre compte</div>
        <h2>${force ? 'Choisissez votre mot de passe' : 'Changer mon mot de passe'}</h2>
        <p class="muted small">${force ? 'Pour sécuriser votre espace, remplacez le mot de passe provisoire par le vôtre. Vous l’utiliserez pour vos prochaines connexions.' : 'Au moins 8 caractères.'}</p>
        <label for="pw1">Nouveau mot de passe</label><input type="password" id="pw1" autocomplete="new-password" minlength="8">
        <label for="pw2">Confirmer le mot de passe</label><input type="password" id="pw2" autocomplete="new-password" minlength="8">
        <div class="err-box hidden" id="pw-err"></div>
        <div class="actions"><button class="btn btn-navy" type="button" id="pw-ok">Enregistrer</button>${force ? '' : '<button class="btn btn-line" type="button" id="pw-cancel">Annuler</button>'}</div>
      </div>`;
      document.body.appendChild(w);
      const q = s => w.querySelector(s);
      q('#pw1').focus();
      const fail = m => { q('#pw-err').textContent = m; q('#pw-err').classList.remove('hidden'); };
      if (!force) q('#pw-cancel').onclick = () => { w.remove(); resolve(false); };
      q('#pw-ok').onclick = async () => {
        const a = q('#pw1').value, b = q('#pw2').value;
        if (a.length < 8) return fail('Au moins 8 caractères.');
        if (a !== b) return fail('Les deux mots de passe ne correspondent pas.');
        q('#pw-ok').disabled = true;
        try { await API.updatePassword(a); w.remove(); toast('Mot de passe enregistré'); resolve(true); }
        catch (e) { fail(errMsg(e)); q('#pw-ok').disabled = false; }
      };
    });
  }
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
  }
  function errMsg(e) { return (e && (e.message || e.error_description)) || 'Une erreur est survenue.'; }

  window.RI = { normalizeClient, workflowFor, isNewWorkflow, visitWaived, requirementText, roadmapFor, teamFor, waDigits, initials, DEFAULT_ADVISOR, DEFAULT_AGENT, FIN_STAGES, DAAM, DOC_TYPES, typesFor, youtubeId, genPassword, passwordModal, fmtDateTime, propsTable, API, STEPS, FORMULES, CATEGORIES, PIECES, MODES, visitNo, stepsFor, esc, fmtDate, toast, errMsg, cfg };
})();

