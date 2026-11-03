const { randomInt } = require('node:crypto');
const { realtimeDatabase } = require('../config/firebaseAdmin');

const COMPLAINTS_PATH = 'complaints';

function publicComplaint(complaint) {
  return {
    code: complaint.code,
    cat: complaint.cat,
    loc: complaint.loc,
    text: complaint.text,
    at: complaint.at,
    priority: complaint.priority,
    unit: complaint.unit,
    coordinates: complaint.coordinates || null,
    waitingForInfo: Boolean(complaint.waitingForInfo),
    infoPrompt: complaint.waitingForInfo ? complaint.infoPrompt : '',
    infoRequestedAt: complaint.waitingForInfo ? complaint.infoRequestedAt : null,
    infoResponse: complaint.infoResponse || null,
    rating: complaint.rating || null,
    log: (complaint.log || []).filter((entry) => entry.visibility !== 'internal'),
  };
}

function closed(complaint) {
  const latest = complaint.log?.[complaint.log.length - 1]?.s;
  return latest === 3 || latest === -1;
}

function addAudit(complaint, kind, by, note) {
  complaint.audit = Array.isArray(complaint.audit) ? complaint.audit : [];
  complaint.audit.push({ kind, at: new Date().toISOString(), by, note });
}

async function listComplaints() {
  const snapshot = await realtimeDatabase().ref(COMPLAINTS_PATH).get();
  const complaints = snapshot.val() || {};
  return Object.values(complaints).sort((a, b) => b.at.localeCompare(a.at));
}

async function findComplaintByCode(code) {
  const snapshot = await realtimeDatabase().ref(`${COMPLAINTS_PATH}/${code}`).get();
  return snapshot.exists() ? snapshot.val() : null;
}

async function createComplaint(input) {
  const now = new Date().toISOString();
  let code;
  let reference;
  do {
    const date = new Date();
    const prefix = `ADU-${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}`;
    code = `${prefix}-${String(randomInt(0, 1000000)).padStart(6, '0')}`;
    reference = realtimeDatabase().ref(`${COMPLAINTS_PATH}/${code}`);
  } while ((await reference.get()).exists());

  const complaint = {
    code,
    cat: input.cat,
    loc: input.loc.trim(),
    text: input.text.trim(),
    name: String(input.name || '').trim(),
    at: now,
    priority: input.priority,
    unit: input.unit,
    coordinates: input.coordinates || null,
    evidence: input.evidence || null,
    waitingForInfo: false,
    infoPrompt: '',
    infoRequestedAt: null,
    infoResponse: null,
    rating: null,
    log: [{
      s: 0,
      at: now,
      by: 'Sistem',
      note: 'Aduan diterima. Target waktu mengikuti jenis aduan.',
      visibility: 'public',
    }],
    audit: [],
  };
  addAudit(complaint, 'created', 'Sistem', 'Aduan baru diterima.');
  await reference.set(complaint);
  return complaint;
}

async function applyStaffAction(code, input, user) {
  const reference = realtimeDatabase().ref(`${COMPLAINTS_PATH}/${code}`);
  const result = await reference.transaction((current) => {
    if (!current) return;
    if (user.role !== 'admin' && current.unit !== user.unit) return;
    if (closed(current)) return;

    const complaint = {
      ...current,
      log: Array.isArray(current.log) ? [...current.log] : [],
      audit: Array.isArray(current.audit) ? [...current.audit] : [],
    };
    const now = new Date().toISOString();
    const operation = input.operation === 'request-info' ? 'request-info' : 'update';
    const note = String(input.note || '').trim();
    const visibility = input.visibility;
    if (note.length < 10 || note.length > 2000) return;
    if (!['public', 'internal'].includes(visibility)) return;
    if (operation === 'request-info' && visibility !== 'public') return;

    if (['normal', 'high', 'urgent'].includes(input.priority) && input.priority !== current.priority) {
      complaint.priority = input.priority;
      addAudit(complaint, 'priority', user.name, `Prioritas diubah menjadi ${input.priority}.`);
    }
    if (user.role === 'admin' && typeof input.unit === 'string' && input.unit.trim() && input.unit !== current.unit) {
      complaint.unit = input.unit.trim();
      addAudit(complaint, 'assignment', user.name, `Aduan diteruskan ke ${complaint.unit}.`);
    }

    if (operation === 'request-info') {
      complaint.waitingForInfo = true;
      complaint.infoPrompt = note;
      complaint.infoRequestedAt = now;
      addAudit(complaint, 'request-info', user.name, 'Petugas meminta informasi tambahan dari warga.');
    } else {
      const currentStatus = complaint.log?.[complaint.log.length - 1]?.s ?? 0;
      const nextStatus = Number(input.status);
      if (!Number.isInteger(nextStatus) || (nextStatus !== -1 && nextStatus !== currentStatus + 1)) return;
      complaint.log = Array.isArray(complaint.log) ? complaint.log : [];
      complaint.log.push({ s: nextStatus, at: now, by: user.name, note, visibility });
      complaint.waitingForInfo = false;
      if (typeof input.evidence === 'string' && input.evidence.startsWith('data:image/jpeg;base64,') && input.evidence.length <= 2800000) {
        complaint.evidence = input.evidence;
      }
      addAudit(complaint, 'status', user.name, `Status diubah menjadi ${nextStatus === -1 ? 'Ditolak' : ['Diterima', 'Diverifikasi', 'Diproses', 'Selesai'][nextStatus]}.`);
    }
    return complaint;
  });

  return result.committed ? result.snapshot.val() : null;
}

async function addResidentReply(code, note) {
  const reference = realtimeDatabase().ref(`${COMPLAINTS_PATH}/${code}`);
  const result = await reference.transaction((current) => {
    if (!current || !current.waitingForInfo || note.length < 5 || note.length > 2000) return;
    const complaint = {
      ...current,
      audit: Array.isArray(current.audit) ? [...current.audit] : [],
      waitingForInfo: false,
    };
    complaint.infoResponse = { note, at: new Date().toISOString() };
    addAudit(complaint, 'citizen-response', 'Warga', 'Balasan atas permintaan informasi diterima.');
    return complaint;
  });
  return result.committed ? result.snapshot.val() : null;
}

async function addRating(code, score, comment) {
  const reference = realtimeDatabase().ref(`${COMPLAINTS_PATH}/${code}`);
  const result = await reference.transaction((current) => {
    if (!current || !closed(current) || current.rating || !Number.isInteger(score) || score < 1 || score > 5) return;
    const complaint = {
      ...current,
      audit: Array.isArray(current.audit) ? [...current.audit] : [],
    };
    complaint.rating = { score, comment: comment.slice(0, 300), at: new Date().toISOString() };
    addAudit(complaint, 'rating', 'Warga', `Penilaian layanan ${score}/5 diterima.`);
    return complaint;
  });
  return result.committed ? result.snapshot.val() : null;
}

async function deleteComplaints(codes) {
  const updates = {};
  codes.forEach((code) => { updates[code] = null; });
  await realtimeDatabase().ref(COMPLAINTS_PATH).update(updates);
}

module.exports = {
  addRating,
  addResidentReply,
  applyStaffAction,
  createComplaint,
  deleteComplaints,
  findComplaintByCode,
  listComplaints,
  publicComplaint,
};
const seedComplaints = [
  {
    code: 'ADU-2610-0101',
    cat: 'Sampah',
    loc: 'Gang Kenanga RT 01/RW 03',
    text: 'Tumpukan sampah di sudut gang sudah seminggu tidak diangkut dan mulai berbau.',
    at: new Date(Date.now() - 4 * 86400000).toISOString(),
    name: 'Warga',
    priority: 'high',
    unit: 'Dinas Kebersihan',
    evidence: null,
    waitingForInfo: false,
    coordinates: [-6.2001, 106.8172],
    log: [
      { s: 0, at: new Date(Date.now() - 4 * 86400000).toISOString(), by: 'Sistem', note: 'Aduan diterima dan tercatat.' },
      { s: 1, at: new Date(Date.now() - 3 * 86400000).toISOString(), by: 'Rani Pratama', note: 'Titik sampah sudah dicek.' },
    ],
    audit: [],
    rating: null,
    infoPrompt: '',
    infoResponse: null,
  },
  {
    code: 'ADU-2610-0119',
    cat: 'Layanan administrasi',
    loc: 'Kantor kelurahan',
    text: 'Mohon bantuan mengurus perubahan data kependudukan karena KK salah ketik.',
    at: new Date(Date.now() - 6 * 86400000).toISOString(),
    name: 'Warga',
    priority: 'normal',
    unit: 'Bagian Pelayanan Kelurahan',
    evidence: null,
    waitingForInfo: false,
    coordinates: [-6.1988, 106.8154],
    log: [
      { s: 0, at: new Date(Date.now() - 6 * 86400000).toISOString(), by: 'Sistem', note: 'Aduan diterima dan tercatat.' },
      { s: -1, at: new Date(Date.now() - 5 * 86400000).toISOString(), by: 'Bagian Pelayanan Kelurahan', note: 'Perubahan data KK bukan wewenang kelurahan.' },
    ],
    audit: [],
    rating: null,
    infoPrompt: '',
    infoResponse: null,
  },
  {
    code: 'ADU-2610-0138',
    cat: 'Jalan rusak',
    loc: 'Jl. Anggrek RT 02/RW 01',
    text: 'Aspal berlubang di tikungan, dua pengendara motor sudah jatuh.',
    at: new Date(Date.now() - 12 * 86400000).toISOString(),
    name: 'Warga',
    priority: 'urgent',
    unit: 'Seksi Pemeliharaan Jalan',
    evidence: null,
    waitingForInfo: false,
    coordinates: [-6.2019, 106.8139],
    log: [
      { s: 0, at: new Date(Date.now() - 12 * 86400000).toISOString(), by: 'Sistem', note: 'Aduan diterima dan tercatat.' },
      { s: 1, at: new Date(Date.now() - 11 * 86400000).toISOString(), by: 'Seksi Pemeliharaan Jalan', note: 'Lubang diukur sekitar 12 cm.' },
      { s: 2, at: new Date(Date.now() - 8 * 86400000).toISOString(), by: 'Dinas PU', note: 'Tim tambal cepat dijadwalkan.' },
      { s: 3, at: new Date(Date.now() - 5 * 86400000).toISOString(), by: 'Dinas PU', note: 'Lubang sudah ditambal dan dipadatkan.' },
    ],
    audit: [],
    rating: { score: 4, comment: 'Respons cepat setelah diteruskan.', at: new Date(Date.now() - 4 * 86400000).toISOString() },
    infoPrompt: '',
    infoResponse: null,
  },
];

function normalizeComplaint(ticket) {
  const next = { ...ticket };
  next.log = Array.isArray(next.log) ? next.log : [];
  next.audit = Array.isArray(next.audit) ? next.audit : [];
  next.priority = ['normal', 'high', 'urgent'].includes(next.priority) ? next.priority : 'normal';
  next.waitingForInfo = Boolean(next.waitingForInfo);
  next.coordinates = Array.isArray(next.coordinates) ? next.coordinates : null;
  next.evidence = next.evidence || null;
  next.infoResponse = next.infoResponse || null;
  next.infoPrompt = next.infoPrompt || '';
  next.rating = next.rating || null;
  if (!next.audit.length && next.log.length) {
    next.audit = next.log.map((entry) => ({
      kind: 'status',
      at: entry.at,
      by: entry.by,
      note: entry.note,
    }));
  }
  return next;
}

const complaints = seedComplaints.map((ticket) => normalizeComplaint(ticket));

function listComplaints() {
  return complaints.map((ticket) => normalizeComplaint(ticket));
}

function findComplaintByCode(code) {
  return complaints.find((ticket) => ticket.code === String(code).trim().toUpperCase()) || null;
}

function createComplaint(data) {
  const safeData = normalizeComplaint({
    code: data.code,
    cat: data.cat,
    loc: data.loc,
    text: data.text,
    name: data.name || '',
    at: data.at || new Date().toISOString(),
    priority: data.priority || 'normal',
    unit: data.unit || 'Koordinasi Lintas Instansi',
    evidence: data.evidence || null,
    waitingForInfo: Boolean(data.waitingForInfo),
    coordinates: Array.isArray(data.coordinates) ? data.coordinates : null,
    log: Array.isArray(data.log) ? data.log : [],
    audit: Array.isArray(data.audit) ? data.audit : [],
    rating: data.rating || null,
    infoPrompt: data.infoPrompt || '',
    infoResponse: data.infoResponse || null,
  });

  complaints.push(safeData);
  return normalizeComplaint(safeData);
}

function updateComplaint(code, payload = {}) {
  const complaint = findComplaintByCode(code);
  if (!complaint) return null;

  Object.assign(complaint, normalizeComplaint({
    ...complaint,
    ...payload,
  }));

  return normalizeComplaint(complaint);
}

module.exports = {
  listComplaints,
  findComplaintByCode,
  createComplaint,
  updateComplaint,
  normalizeComplaint,
};
