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
  };
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
    { id: 'd2', client_id: 'demo-1', title: 'Compte rendu · Visite 1 · Bir Rami', category: 'compte_rendu', created_at: '2026-10-09', url: '#' },
    { id: 'd3', client_id: 'demo-1', title: 'Compte rendu · Visite 2 · Maamora', category: 'compte_rendu', created_at: '2026-10-20', url: '#' },
    { id: 'd4', client_id: 'demo-1', title: 'Compte rendu · Visite 3 · Centre-ville', category: 'compte_rendu', created_at: '2026-10-21', url: '#' },
    { id: 'd5', client_id: 'demo-1', title: 'Vidéo · Visite 2 · Maamora', category: 'video', created_at: '2026-10-20', url: '#' },
    { id: 'd6', client_id: 'demo-1', title: 'Contrat d’accompagnement signé', category: 'contrat', created_at: '2026-10-09', url: '#' },
    { id: 'd7', client_id: 'demo-1', title: 'Bon de visite n° 014', category: 'contrat', created_at: '2026-10-20', url: '#' },
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
      return data.session ? { email: data.session.user.email } : null;
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
    async addDoc(clientId, { title, category, file, url }) {
      if (DEMO) { const d = { id: uid(), client_id: clientId, title, category, url: url || '#', created_at: today() }; demoDocs.unshift(d); return d; }
      const c = await client();
      let storage_path = null;
      if (file) {
        const safe = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
        storage_path = `${clientId}/${Date.now()}-${safe}`;
        const { error } = await c.storage.from(cfg.BUCKET).upload(storage_path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
      }
      const { data, error } = await c.from('documents').insert({ client_id: clientId, title, category, storage_path, url: url || null }).select().single();
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
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
  }
  function errMsg(e) { return (e && (e.message || e.error_description)) || 'Une erreur est survenue.'; }

  window.RI = { API, STEPS, FORMULES, CATEGORIES, stepsFor, esc, fmtDate, toast, errMsg, cfg };
})();
