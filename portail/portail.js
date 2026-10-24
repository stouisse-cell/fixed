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
      ['Plan d’Acquisition et 1ère visite', 'Présentation de votre Plan et de votre premier compte rendu lors du 2e appel.'],
      ['Visites et comptes rendus', 'Visites filmées et comptes rendus sous 72 heures ouvrables.'],
      ['Comparatif et choix du bien', 'Les meilleures options côte à côte, présentées par appel vidéo.'],
      ['Négociation et compromis', 'Offre validée par vous, relecture du compromis, financement.'],
      ['Acte et remise des clés', 'Signature chez le notaire et remise de votre Dossier Propriétaire.'],
    ],
    vefa: [
      ['Consultation découverte', 'Nous faisons connaissance et définissons votre projet.'],
      ['Plan d’Acquisition et 1ère visite', 'Présentation de votre Plan et de votre premier compte rendu lors du 2e appel.'],
      ['Visites de projets', 'Projets visités et filmés, promoteurs vérifiés.'],
      ['Comparatif et choix du logement', 'Comparaison des projets et choix du logement.'],
      ['Contrat de réservation', 'Négociation, relecture du contrat et réservation.'],
      ['Suivi de chantier et livraison', 'Du gros œuvre à la remise des clés.'],
    ],
    mise_en_relation: [
      ['Consultation découverte', 'Nous faisons connaissance et définissons votre recherche.'],
      ['Biens présentés', 'Les biens disponibles correspondant à vos critères.'],
      ['Visites', 'Visites sur place ou à distance.'],
      ['Offre et compromis', 'Intermédiation avec le vendeur jusqu’au compromis.'],
      ['Acte de vente', 'Signature chez le notaire.'],
    ],
  };
  const FORMULES = {
    essentiel: { label: 'Formule Essentiel', steps: 'standard' },
    premium: { label: 'Formule Premium', steps: 'standard' },
    vefa: { label: 'VEFA Recherche', steps: 'vefa' },
    mise_en_relation: { label: 'Mise en relation', steps: 'mise_en_relation' },
  };
  const CATEGORIES = {
    plan: 'Plan d’Acquisition',
    compte_rendu: 'Comptes rendus de visite',
    video: 'Vidéos des visites',
    comparatif: 'Comparatif des biens',
    negociation: 'Stratégie de négociation',
    contrat: 'Contrats et bons de visite',
    dossier: 'Dossier Propriétaire',
    autre: 'Autres documents',
    piece_client: 'Pièces déposées par le client',
  };
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
  const stepsFor = f => STEPS[(FORMULES[f] || FORMULES.essentiel).steps];

  // ---------- mode démonstration ----------
  const demoClients = [
    { id: 'demo-1', email: 'famille.alaoui@exemple.com', full_name: 'Famille Alaoui', formule: 'premium', city: 'Kénitra', current_step: 3,
      step_dates: { 1: '2026-09-28', 2: '2026-10-09', 3: '2026-10-21' },
      message: 'Bonjour ! Les comptes rendus des visites 2 et 3 sont en ligne. L’appartement de Maamora est notre coup de cœur : nous en parlons lors de l’appel vidéo du 28 octobre.',
      message_date: '2026-10-21', created_at: '2026-09-28' },
    { id: 'demo-2', email: 'k.bennani@exemple.com', full_name: 'Karim Bennani', formule: 'vefa', city: 'Kénitra', current_step: 2,
      step_dates: { 1: '2026-10-14' }, message: '', message_date: null, created_at: '2026-10-14' },
  ];
  const demoDocs = [
    { id: 'd1', client_id: 'demo-1', title: 'Plan d’Acquisition Personnalisé', category: 'plan', created_at: '2026-10-09', url: '#' },
    { id: 'd2', client_id: 'demo-1', title: 'Compte rendu · Visite 1 · Bir Rami', category: 'compte_rendu', visit_id: 'v0', created_at: '2026-10-09', url: '#' },
    { id: 'd3', client_id: 'demo-1', title: 'Compte rendu · Visite 2 · Maamora', category: 'compte_rendu', visit_id: 'v1', created_at: '2026-10-20', url: '#' },
    { id: 'd4', client_id: 'demo-1', title: 'Compte rendu · Visite 3 · Centre-ville', category: 'compte_rendu', created_at: '2026-10-21', url: '#' },
    { id: 'd5', client_id: 'demo-1', title: 'Vidéo · Visite 2 · Maamora', category: 'video', visit_id: 'v1', created_at: '2026-10-20', url: '#' },
    { id: 'd6', client_id: 'demo-1', title: 'Contrat d’accompagnement signé', category: 'contrat', created_at: '2026-10-09', url: '#' },
    { id: 'd7', client_id: 'demo-1', title: 'Bon de visite n° 014', category: 'contrat', created_at: '2026-10-20', url: '#' },
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
      const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: true } });
      if (error) throw error;
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
      if (DEMO) return demoClients[0];
      const c = await client();
      const { data, error } = await c.from('clients').select('*').limit(1);
      if (error) throw error;
      return data[0] || null;
    },
    async getClient(id) {
      if (DEMO) return demoClients.find(c => c.id === id) || null;
      const c = await client();
      const { data, error } = await c.from('clients').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
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
    // ---- admin ----
    async listClients() {
      if (DEMO) return [...demoClients];
      const c = await client();
      const { data, error } = await c.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async saveClient(row) {
      row = { ...row }; if (row.email !== undefined) row.email = String(row.email).trim().toLowerCase();
      if (DEMO) {
        if (!row.id) { row = { id: uid(), current_step: 1, step_dates: { 1: today() }, created_at: today(), message: '', ...row }; demoClients.unshift(row); return row; }
        const i = demoClients.findIndex(x => x.id === row.id); demoClients[i] = { ...demoClients[i], ...row }; return demoClients[i];
      }
      const c = await client();
      if (!row.id) {
        delete row.id;
        const { data, error } = await c.from('clients').insert({ current_step: 1, step_dates: { 1: today() }, ...row }).select().single();
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
    async addDoc(clientId, { title, category, file, url, visit_id }) {
      if (DEMO) { const d = { id: uid(), client_id: clientId, title, category, visit_id: visit_id || null, url: url || '#', created_at: today() }; demoDocs.unshift(d); return d; }
      const c = await client();
      let storage_path = null;
      if (file) {
        const safe = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
        storage_path = `${clientId}/${Date.now()}-${safe}`;
        const { error } = await c.storage.from(cfg.BUCKET).upload(storage_path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
      }
      const { data, error } = await c.from('documents').insert({ client_id: clientId, title, category, storage_path, url: url || null, visit_id: visit_id || null }).select().single();
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

  window.RI = { youtubeId, genPassword, passwordModal, fmtDateTime, propsTable, API, STEPS, FORMULES, CATEGORIES, PIECES, MODES, visitNo, stepsFor, esc, fmtDate, toast, errMsg, cfg };
})();
