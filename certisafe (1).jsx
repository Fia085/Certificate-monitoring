import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, FileBadge, UploadCloud, Users, ClipboardList,
  ArrowLeftRight, Bell, Settings, Search, Plus, Eye, Pencil,
  Trash2, Check, Minus, X, LogOut, Lock, Mail, ChevronDown, ShieldAlert,
  CheckCircle2, XCircle, Clock3, QrCode, Download
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const NAVY = "#0B1E3D";

const CERT_TYPES = ["SIO Forklift", "SIO Crane", "P3K", "Fire Fighting", "Working at Height", "Confined Space", "Electrical Safety", "K3 Umum"];
const DIVISIONS = ["Produksi", "Warehouse", "Maintenance", "Engineering", "Administrasi"];
const JABATAN = ["Operator Forklift", "Operator Produksi", "Supervisor Warehouse", "Teknisi Maintenance", "Staff Engineering", "Supervisor Produksi", "Operator", "Engineer", "Teknisi"];
const ROLES = ["HSE Admin", "HRD", "Karyawan"];

const seedEmployees = [
  { id: "E1", nama: "Budi Santoso", divisi: "Warehouse", jabatan: "Operator Forklift" },
  { id: "E2", nama: "Rina Agustina", divisi: "Produksi", jabatan: "Operator Produksi" },
  { id: "E3", nama: "Dedi Pratama", divisi: "Maintenance", jabatan: "Teknisi Maintenance" },
  { id: "E4", nama: "Siti Nurhaliza", divisi: "Engineering", jabatan: "Staff Engineering" },
  { id: "E5", nama: "Andi Wijaya", divisi: "Warehouse", jabatan: "Operator Forklift" },
  { id: "E6", nama: "Tono", divisi: "Produksi", jabatan: "Operator" },
];

function addYears(dateStr, years) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}
function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  return Math.round((d - now) / 86400000);
}
function statusOf(expiredStr) {
  const days = daysUntil(expiredStr);
  if (days < 0) return "Expired";
  if (days <= 90) return "Akan Expired";
  return "Aktif";
}
function fmtDate(s) {
  if (!s) return "-";
  const d = new Date(s);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function fmtDateTime(s) {
  const d = new Date(s);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}
function slugEmail(nama) {
  return nama.toLowerCase().replace(/[^a-z]+/g, ".") + "@perusahaan.co.id";
}

const seedCertificates = [
  { id: "C1", employeeId: "E1", jenis: "SIO Forklift", no: "SIO-12345", lembaga: "PT. Safety Training Center", terbit: "2023-12-20", expired: addYears("2023-12-20", 3), verifikasi: "Terverifikasi", catatan: "", file: "sertifikat_sio_forklift_budi.pdf", riwayat: [{ tanggal: "2023-12-20T09:00:00", aksi: "Diupload oleh Budi Santoso (Karyawan)" }, { tanggal: "2023-12-21T10:30:00", aksi: "Diverifikasi oleh Lutfia Irfani (HSE Admin)" }] },
  { id: "C2", employeeId: "E2", jenis: "Fire Fighting", no: "FF-67890", lembaga: "Dinas Damkar", terbit: "2023-06-15", expired: "2026-09-25", verifikasi: "Terverifikasi", catatan: "", file: "sertifikat_ff_rina.pdf", riwayat: [{ tanggal: "2023-06-15T09:00:00", aksi: "Diupload oleh Rina Agustina (Karyawan)" }, { tanggal: "2023-06-16T09:00:00", aksi: "Diverifikasi oleh Lutfia Irfani (HSE Admin)" }] },
  { id: "C3", employeeId: "E3", jenis: "Working at Height", no: "WAH-11223", lembaga: "PT. Height Safety", terbit: "2023-01-10", expired: "2026-09-18", verifikasi: "Terverifikasi", catatan: "", file: "sertifikat_wah_dedi.pdf", riwayat: [{ tanggal: "2023-01-10T09:00:00", aksi: "Diupload oleh Dedi Pratama (Karyawan)" }, { tanggal: "2023-01-11T09:00:00", aksi: "Diverifikasi oleh Lutfia Irfani (HSE Admin)" }] },
  { id: "C4", employeeId: "E4", jenis: "K3 Umum", no: "K3-33445", lembaga: "Kemnaker", terbit: "2024-05-03", expired: "2027-05-03", verifikasi: "Terverifikasi", catatan: "", file: "sertifikat_k3_siti.pdf", riwayat: [{ tanggal: "2024-05-03T09:00:00", aksi: "Diupload oleh Siti Nurhaliza (Karyawan)" }, { tanggal: "2024-05-04T09:00:00", aksi: "Diverifikasi oleh Lutfia Irfani (HSE Admin)" }] },
  { id: "C5", employeeId: "E5", jenis: "SIO Forklift", no: "SIO-56567", lembaga: "PT. Safety Training Center", terbit: "2024-12-08", expired: "2027-12-08", verifikasi: "Terverifikasi", catatan: "", file: "sertifikat_sio_andi.pdf", riwayat: [{ tanggal: "2024-12-08T09:00:00", aksi: "Diupload oleh Andi Wijaya (Karyawan)" }, { tanggal: "2024-12-09T09:00:00", aksi: "Diverifikasi oleh Lutfia Irfani (HSE Admin)" }] },
  { id: "C6", employeeId: "E6", jenis: "Fire Fighting", no: "FF-77889", lembaga: "Dinas Damkar", terbit: "2022-09-25", expired: "2025-09-25", verifikasi: "Terverifikasi", catatan: "", file: "sertifikat_ff_tono.pdf", riwayat: [{ tanggal: "2022-09-25T09:00:00", aksi: "Diupload oleh Tono (Karyawan)" }, { tanggal: "2022-09-26T09:00:00", aksi: "Diverifikasi oleh Lutfia Irfani (HSE Admin)" }] },
  { id: "C7", employeeId: "E5", jenis: "SIO Crane", no: "SIO-88121", lembaga: "PT. Alat Berat Indonesia", terbit: "2026-08-01", expired: "2029-08-01", verifikasi: "Menunggu", catatan: "", file: "sertifikat_sio_crane_andi.jpg", riwayat: [{ tanggal: "2026-08-02T14:00:00", aksi: "Diupload oleh Andi Wijaya (Karyawan)" }] },
  { id: "C8", employeeId: "E6", jenis: "P3K", no: "P3K-44120", lembaga: "PMI Cabang Kota", terbit: "2026-07-20", expired: "2029-07-20", verifikasi: "Ditolak", catatan: "Foto sertifikat buram dan nomor tidak terbaca, mohon upload ulang dengan foto yang jelas.", file: "sertifikat_p3k_tono.jpg", riwayat: [{ tanggal: "2026-07-21T11:00:00", aksi: "Diupload oleh Tono (Karyawan)" }, { tanggal: "2026-07-22T09:00:00", aksi: "Ditolak oleh Lutfia Irfani (HSE Admin) — perlu revisi" }] },
];

const seedMatrix = {
  "Operator Forklift": { "SIO Forklift": true },
  "Operator Produksi": { "K3 Umum": true },
  "Supervisor Warehouse": { "P3K": true, "Fire Fighting": true },
  "Teknisi Maintenance": { "Working at Height": true, "Confined Space": true },
  "Staff Engineering": { "K3 Umum": true },
  "Supervisor Produksi": { "P3K": true, "Fire Fighting": true },
};

const seedUsers = [
  { id: "U1", nama: "Lutfia Irfani", email: "admin@certisafe.com", password: "admin123", role: "HSE Admin" },
  { id: "U2", nama: "Hendra Wibowo", email: "hrd@certisafe.com", password: "hrd123", role: "HRD" },
];

const seedSettings = {
  emailNotif: true,
  reminderDays: [90, 30, 7],
  companyName: "PT. Industri Sejahtera",
};

const STORAGE_KEYS = {
  employees: "certisafe:employees",
  certificates: "certisafe:certificates",
  matrix: "certisafe:matrix",
  mutations: "certisafe:mutations",
  users: "certisafe:users",
  settings: "certisafe:settings",
};

function useStoredState(key, seed) {
  const [value, setValue] = useState(seed);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(key, false);
        if (res && res.value) setValue(JSON.parse(res.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    window.storage.set(key, JSON.stringify(value), false).catch(() => {});
  }, [value, loaded, key]);
  return [value, setValue, loaded];
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sertifikat", label: "Sertifikat", icon: FileBadge },
  { id: "upload", label: "Upload Sertifikat", icon: UploadCloud },
  { id: "karyawan", label: "Data Karyawan", icon: Users },
  { id: "matrix", label: "Requirement Matrix", icon: ClipboardList },
  { id: "mutasi", label: "Perpindahan Karyawan", icon: ArrowLeftRight, restrictedTo: "HRD" },
  { id: "notifikasi", label: "Notifikasi", icon: Bell },
];

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div style={{
      position: "fixed", top: 18, right: 18, zIndex: 999, background: ok ? "#16A34A" : "#DC2626",
      color: "white", padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)", maxWidth: 340, display: "flex", gap: 10, alignItems: "flex-start"
    }}>
      {ok ? <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> : <XCircle size={18} style={{ flexShrink: 0 }} />}
      <span>{toast.message}</span>
    </div>
  );
}

function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 14, width, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #F1F5F9", position: "sticky", top: 0, background: "white" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
          <X size={18} style={{ cursor: "pointer", color: "#64748B" }} onClick={onClose} />
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", boxSizing: "border-box", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 11px", fontSize: 13, outline: "none" };
function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: "#334155", marginBottom: 5, fontWeight: 500 }}>{label}</div>
      {children}
      {error && <div style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

// ---------- AUTH SCREENS ----------
function AuthShell({ children, subtitle }) {
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${NAVY} 0%, #1E3A63 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, width: 400, maxWidth: "100%", padding: "32px 30px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileBadge size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 19, color: NAVY }}>CertiSafe</span>
        </div>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 22 }}>{subtitle}</div>
        {children}
      </div>
    </div>
  );
}

function LoginPage({ users, onLogin, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!u) { setError("Username/email atau kata sandi salah."); return; }
    setError("");
    onLogin(u);
  };
  return (
    <AuthShell subtitle="Masuk ke Sistem Manajemen Sertifikasi Karyawan">
      <Field label="Email / Username">
        <div style={{ position: "relative" }}>
          <Mail size={15} color="#94A3B8" style={{ position: "absolute", left: 10, top: 11 }} />
          <input style={{ ...inputStyle, paddingLeft: 32 }} value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@perusahaan.co.id" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
      </Field>
      <Field label="Kata Sandi">
        <div style={{ position: "relative" }}>
          <Lock size={15} color="#94A3B8" style={{ position: "absolute", left: 10, top: 11 }} />
          <input type="password" style={{ ...inputStyle, paddingLeft: 32 }} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
      </Field>
      {error && <div style={{ color: "#DC2626", fontSize: 12, marginBottom: 10 }}>{error}</div>}
      <button onClick={submit} style={{ width: "100%", background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>Masuk</button>
      <div style={{ textAlign: "center", fontSize: 13, color: "#64748B", marginTop: 16 }}>
        Belum punya akun? <span onClick={goRegister} style={{ color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Daftar di sini</span>
      </div>
      <div style={{ marginTop: 18, background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "#94A3B8" }}>
        Contoh akun demo: <b>admin@certisafe.com</b> / admin123 (HSE Admin) atau <b>hrd@certisafe.com</b> / hrd123 (HRD)
      </div>
    </AuthShell>
  );
}

function RegisterPage({ users, setUsers, goLogin, showToast }) {
  const [form, setForm] = useState({ nama: "", email: "", password: "", confirm: "", role: "Karyawan" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    const err = {};
    if (!form.nama.trim()) err.nama = "Nama wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Format email tidak valid.";
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) err.email = "Email sudah terdaftar.";
    if (form.password.length < 6) err.password = "Kata sandi minimal 6 karakter.";
    if (form.confirm !== form.password) err.confirm = "Konfirmasi kata sandi tidak cocok.";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    const newUser = { id: "U" + Date.now(), nama: form.nama, email: form.email, password: form.password, role: form.role };
    setUsers(prev => [...prev, newUser]);
    showToast("success", "Akun berhasil dibuat. Silakan masuk menggunakan email dan kata sandi Anda.");
    goLogin();
  };

  return (
    <AuthShell subtitle="Daftar akun baru untuk mengakses CertiSafe">
      <Field label="Nama Lengkap" error={errors.nama}>
        <input style={inputStyle} value={form.nama} onChange={e => set("nama", e.target.value)} placeholder="Masukkan nama lengkap" />
      </Field>
      <Field label="Email" error={errors.email}>
        <div style={{ position: "relative" }}>
          <Mail size={15} color="#94A3B8" style={{ position: "absolute", left: 10, top: 11 }} />
          <input style={{ ...inputStyle, paddingLeft: 32 }} value={form.email} onChange={e => set("email", e.target.value)} placeholder="nama@perusahaan.co.id" />
        </div>
      </Field>
      <Field label="Peran / Role">
        <select style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)}>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Kata Sandi" error={errors.password}>
        <input type="password" style={inputStyle} value={form.password} onChange={e => set("password", e.target.value)} placeholder="Minimal 6 karakter" />
      </Field>
      <Field label="Konfirmasi Kata Sandi" error={errors.confirm}>
        <input type="password" style={inputStyle} value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="Ulangi kata sandi" />
      </Field>
      <button onClick={submit} style={{ width: "100%", background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>Daftar Akun</button>
      <div style={{ textAlign: "center", fontSize: 13, color: "#64748B", marginTop: 16 }}>
        Sudah punya akun? <span onClick={goLogin} style={{ color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Masuk di sini</span>
      </div>
    </AuthShell>
  );
}

// ---------- MAIN APP ----------
export default function App() {
  const [authView, setAuthView] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [detailCertId, setDetailCertId] = useState(null);
  const [editCertId, setEditCertId] = useState(null);
  const [toast, setToast] = useState(null);
  const [statModal, setStatModal] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const [employees, setEmployees, empLoaded] = useStoredState(STORAGE_KEYS.employees, seedEmployees);
  const [certificates, setCertificates, certLoaded] = useStoredState(STORAGE_KEYS.certificates, seedCertificates);
  const [matrix, setMatrix, matrixLoaded] = useStoredState(STORAGE_KEYS.matrix, seedMatrix);
  const [mutations, setMutations, mutLoaded] = useStoredState(STORAGE_KEYS.mutations, []);
  const [users, setUsers, usersLoaded] = useStoredState(STORAGE_KEYS.users, seedUsers);
  const [settings, setSettings, settingsLoaded] = useStoredState(STORAGE_KEYS.settings, seedSettings);

  const showToast = (type, message) => setToast({ type, message });

  const empById = useMemo(() => Object.fromEntries(employees.map(e => [e.id, e])), [employees]);
  const enriched = useMemo(() => certificates.map(c => ({
    ...c, employee: empById[c.employeeId], status: statusOf(c.expired), days: daysUntil(c.expired),
  })).filter(c => c.employee), [certificates, empById]);

  const ready = empLoaded && certLoaded && matrixLoaded && mutLoaded && usersLoaded && settingsLoaded;

  if (!ready) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontFamily: "sans-serif" }}>Memuat data…</div>;

  if (!currentUser) {
    return authView === "login"
      ? <LoginPage users={users} onLogin={(u) => { setCurrentUser(u); showToast("success", `Selamat datang kembali, ${u.nama}!`); }} goRegister={() => setAuthView("register")} />
      : <RegisterPage users={users} setUsers={setUsers} goLogin={() => setAuthView("login")} showToast={showToast} />;
  }

  const canAccessMutasi = currentUser.role === "HRD";

  const goDetail = (certId) => { setDetailCertId(certId); setPage("detail"); };
  const goEdit = (certId) => { setEditCertId(certId); setPage("edit"); };

  const verifyCert = (certId, approve, note) => {
    setCertificates(prev => prev.map(c => {
      if (c.id !== certId) return c;
      const entry = { tanggal: new Date().toISOString(), aksi: approve ? `Diverifikasi oleh ${currentUser.nama} (${currentUser.role})` : `Ditolak oleh ${currentUser.nama} (${currentUser.role}) — ${note}` };
      return { ...c, verifikasi: approve ? "Terverifikasi" : "Ditolak", catatan: approve ? "" : note, riwayat: [...(c.riwayat || []), entry] };
    }));
    showToast(approve ? "success" : "error", approve ? "Sertifikat berhasil diverifikasi." : "Sertifikat ditolak, notifikasi revisi dikirim ke karyawan (email & aplikasi).");
    setRejectingId(null);
  };

  const deleteCert = (certId) => {
    setCertificates(prev => prev.filter(c => c.id !== certId));
    showToast("success", "Sertifikat berhasil dihapus.");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#F4F6FA", color: "#0F172A" }}>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Sidebar page={page} setPage={setPage} role={currentUser.role} onBlocked={() => showToast("error", "Menu ini hanya dapat diakses oleh HRD.")} />
      <div style={{ flex: 1, overflow: "auto" }}>
        <TopBar page={page} user={currentUser} onLogout={() => { setCurrentUser(null); setAuthView("login"); setPage("dashboard"); }} />
        <div style={{ padding: "24px 28px" }}>
          {page === "dashboard" && (
            <Dashboard certs={enriched} employees={employees} onOpenCert={goDetail} onOpenStat={(key) => setStatModal(key)} />
          )}
          {page === "sertifikat" && (
            <SertifikatList certs={enriched} setPage={setPage} role={currentUser.role}
              onDetail={goDetail} onEdit={goEdit} onDelete={deleteCert}
              onVerify={(id) => verifyCert(id, true)} onReject={(id) => setRejectingId(id)} />
          )}
          {page === "upload" && (
            <CertForm mode="create" employees={employees} currentUser={currentUser}
              onSubmit={(cert) => {
                setCertificates(prev => [...prev, cert]);
                showToast("success", "Sertifikat berhasil diupload dan sedang menunggu verifikasi HSE Admin.");
                setPage("sertifikat");
              }}
              onError={(msg) => showToast("error", msg)} />
          )}
          {page === "edit" && editCertId && (
            <CertForm mode="edit" employees={employees} currentUser={currentUser}
              initial={enriched.find(c => c.id === editCertId)}
              onSubmit={(cert) => {
                setCertificates(prev => prev.map(c => c.id === cert.id ? cert : c));
                showToast("success", "Sertifikat diperbarui dan dikirim ulang untuk verifikasi.");
                setPage("sertifikat");
              }}
              onError={(msg) => showToast("error", msg)} />
          )}
          {page === "detail" && detailCertId && (
            <DetailSertifikat cert={enriched.find(c => c.id === detailCertId)} onBack={() => setPage("sertifikat")} />
          )}
          {page === "karyawan" && <Karyawan employees={employees} setEmployees={setEmployees} certs={enriched} />}
          {page === "matrix" && <RequirementMatrix matrix={matrix} setMatrix={setMatrix} />}
          {page === "mutasi" && (
            canAccessMutasi
              ? <Mutasi employees={employees} setEmployees={setEmployees} mutations={mutations} setMutations={setMutations} matrix={matrix} certs={enriched} />
              : <AccessDenied />
          )}
          {page === "notifikasi" && <Notifikasi certs={enriched} settings={settings} />}
          {page === "pengaturan" && (
            <Pengaturan settings={settings} setSettings={setSettings} currentUser={currentUser} users={users} showToast={showToast} />
          )}
        </div>
      </div>
      {statModal && <StatModal statKey={statModal} certs={enriched} employees={employees} onClose={() => setStatModal(null)} onOpenCert={(id) => { setStatModal(null); goDetail(id); }} />}
      {rejectingId && <RejectModal onClose={() => setRejectingId(null)} onConfirm={(note) => verifyCert(rejectingId, false, note)} />}
    </div>
  );
}

function AccessDenied() {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 40, textAlign: "center" }}>
      <ShieldAlert size={34} color="#DC2626" style={{ marginBottom: 10 }} />
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Akses Ditolak</div>
      <div style={{ color: "#64748B", fontSize: 13 }}>Menu Perpindahan Karyawan hanya dapat diakses oleh akun dengan peran HRD.</div>
    </div>
  );
}

function Sidebar({ page, setPage, role, onBlocked }) {
  return (
    <div style={{ width: 236, background: NAVY, color: "#CBD5E1", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileBadge size={17} color="white" />
        </div>
        <span style={{ color: "white", fontWeight: 700, fontSize: 17 }}>CertiSafe</span>
      </div>
      <div style={{ marginTop: 6, flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = page === item.id || (item.id === "sertifikat" && ["detail", "edit"].includes(page));
          const blocked = item.restrictedTo && item.restrictedTo !== role;
          return (
            <div
              key={item.id}
              onClick={() => blocked ? onBlocked() : setPage(item.id)}
              title={blocked ? "Hanya untuk HRD" : ""}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "10px 20px",
                cursor: "pointer", fontSize: 14,
                background: active ? "rgba(37,99,235,0.18)" : "transparent",
                borderLeft: active ? "3px solid #2563EB" : "3px solid transparent",
                color: blocked ? "#4B5875" : active ? "white" : "#94A3B8",
              }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {blocked && <Lock size={12} style={{ marginLeft: "auto" }} />}
            </div>
          );
        })}
      </div>
      <div onClick={() => setPage("pengaturan")} style={{ padding: "10px 20px 20px", display: "flex", alignItems: "center", gap: 11, color: page === "pengaturan" ? "white" : "#94A3B8", fontSize: 14, cursor: "pointer" }}>
        <Settings size={17} /> Pengaturan
      </div>
    </div>
  );
}

function TopBar({ page, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const labels = { dashboard: "Dashboard", sertifikat: "Sertifikat", upload: "Upload Sertifikat", karyawan: "Data Karyawan", matrix: "Requirement Matrix", mutasi: "Perpindahan Karyawan", notifikasi: "Notifikasi", pengaturan: "Pengaturan", detail: "Detail Sertifikat", edit: "Edit Sertifikat" };
  return (
    <div style={{ height: 60, borderBottom: "1px solid #E2E8F0", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "relative" }}>
      <span style={{ fontWeight: 600, fontSize: 15, color: "#334155" }}>{labels[page] || "Dashboard"}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Bell size={18} color="#64748B" />
        <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#334155" }}>
            {user.nama.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{user.nama}</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{user.role}</div>
          </div>
          <ChevronDown size={14} color="#94A3B8" />
        </div>
        {open && (
          <div style={{ position: "absolute", top: 52, right: 28, background: "white", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.12)", width: 160, overflow: "hidden", zIndex: 50 }}>
            <div onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", cursor: "pointer" }}>
              <LogOut size={15} /> Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "white", borderRadius: 12, padding: "16px 18px", flex: 1, border: "1px solid #EEF2F7", cursor: onClick ? "pointer" : "default", transition: "box-shadow .15s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0F172A" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

const DONUT_COLORS = ["#2563EB", "#7C3AED", "#F59E0B", "#0EA5E9", "#94A3B8"];

function Dashboard({ certs, employees, onOpenCert, onOpenStat }) {
  const verified = certs.filter(c => c.verifikasi === "Terverifikasi");
  const byDivisi = useMemo(() => {
    const map = {};
    verified.forEach(c => { map[c.employee.divisi] = (map[c.employee.divisi] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [verified]);

  const aktif = verified.filter(c => c.status === "Aktif").length;
  const akanExpired = verified.filter(c => c.status === "Akan Expired").length;
  const expired = verified.filter(c => c.status === "Expired").length;
  const barData = [{ name: "Aktif", value: aktif }, { name: "Akan Expired", value: akanExpired }, { name: "Expired", value: expired }];
  const terdekat = [...verified].sort((a, b) => a.days - b.days).slice(0, 4);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Selamat datang 👋</div>
        <div style={{ fontSize: 13, color: "#64748B" }}>Sistem Manajemen Sertifikasi Karyawan</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        <StatCard label="Sertifikat Aktif" value={aktif} color="#16A34A" sub="Klik untuk lihat daftar" onClick={() => onOpenStat("Aktif")} />
        <StatCard label="Akan Expired < 3 Bulan" value={akanExpired} color="#D97706" sub="Klik untuk lihat daftar" onClick={() => onOpenStat("Akan Expired")} />
        <StatCard label="Expired" value={expired} color="#DC2626" sub="Klik untuk lihat daftar" onClick={() => onOpenStat("Expired")} />
        <StatCard label="Total Karyawan" value={employees.length} color="#2563EB" sub="Klik untuk lihat daftar" onClick={() => onOpenStat("Semua")} />
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, padding: 18, flex: 1, border: "1px solid #EEF2F7" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Sertifikasi Berdasarkan Departemen</div>
          <div style={{ height: 220, display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={byDivisi} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                  {byDivisi.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 13 }}>
              {byDivisi.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  {d.name} — {d.value}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: 12, padding: 18, flex: 1, border: "1px solid #EEF2F7" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Status Sertifikat</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: 12, padding: 18, width: 280, border: "1px solid #EEF2F7" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Sertifikasi Terdekat Expired</div>
          {terdekat.map(c => (
            <div key={c.id} onClick={() => onOpenCert(c.id)} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 13, cursor: "pointer" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{c.jenis}</div>
                <div style={{ color: "#64748B", fontSize: 12 }}>{c.employee.nama}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: c.days < 0 ? "#DC2626" : c.days <= 30 ? "#D97706" : "#64748B", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>
                  {c.days < 0 ? "Expired" : `${c.days} hari lagi`}
                </span>
                <Eye size={14} color="#94A3B8" />
              </div>
            </div>
          ))}
          {terdekat.length === 0 && <div style={{ color: "#94A3B8", fontSize: 13 }}>Tidak ada data.</div>}
        </div>
      </div>
    </div>
  );
}

function StatModal({ statKey, certs, employees, onClose, onOpenCert }) {
  const title = statKey === "Semua" ? "Total Karyawan" : `Sertifikat — ${statKey}`;
  let rows;
  if (statKey === "Semua") {
    rows = employees.map(e => ({ employee: e, certs: certs.filter(c => c.employeeId === e.id) }));
  } else {
    const matching = certs.filter(c => c.status === statKey && c.verifikasi === "Terverifikasi");
    const byEmp = {};
    matching.forEach(c => { (byEmp[c.employeeId] = byEmp[c.employeeId] || []).push(c); });
    rows = Object.entries(byEmp).map(([id, list]) => ({ employee: list[0].employee, certs: list }));
  }
  return (
    <Modal title={title} onClose={onClose} width={620}>
      {rows.length === 0 && <div style={{ color: "#94A3B8", fontSize: 13 }}>Tidak ada data untuk kategori ini.</div>}
      {rows.map(r => (
        <div key={r.employee.id} style={{ padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.employee.nama}</div>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>{r.employee.jabatan} · {r.employee.divisi}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {r.certs.length === 0 && <span style={{ fontSize: 12, color: "#CBD5E1" }}>Belum ada sertifikat</span>}
            {r.certs.map(c => (
              <span key={c.id} onClick={() => onOpenCert(c.id)} style={{ fontSize: 11.5, background: "#F1F5F9", padding: "4px 9px", borderRadius: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                {c.jenis} <Badge status={c.status} small />
              </span>
            ))}
          </div>
        </div>
      ))}
    </Modal>
  );
}

function Badge({ status, small }) {
  const styles = {
    "Aktif": { bg: "#DCFCE7", color: "#16A34A" },
    "Akan Expired": { bg: "#FEF3C7", color: "#D97706" },
    "Expired": { bg: "#FEE2E2", color: "#DC2626" },
    "Menunggu": { bg: "#DBEAFE", color: "#2563EB" },
    "Terverifikasi": { bg: "#DCFCE7", color: "#16A34A" },
    "Ditolak": { bg: "#FEE2E2", color: "#DC2626" },
  }[status] || { bg: "#F1F5F9", color: "#64748B" };
  return <span style={{ background: styles.bg, color: styles.color, padding: small ? "1px 6px" : "3px 10px", borderRadius: 20, fontSize: small ? 10.5 : 12, fontWeight: 600 }}>{status}</span>;
}

function SertifikatList({ certs, setPage, role, onDetail, onEdit, onDelete, onVerify, onReject }) {
  const [filter, setFilter] = useState("Semua");
  const [q, setQ] = useState("");
  const filtered = certs.filter(c => {
    if (filter === "Menunggu Verifikasi") return c.verifikasi === "Menunggu";
    if (filter !== "Semua" && c.status !== filter) return false;
    if (q && !(c.employee.nama.toLowerCase().includes(q.toLowerCase()) || c.jenis.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });
  const canModerate = role === "HSE Admin";

  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7" }}>
      <div style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Daftar Sertifikat</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 10px" }}>
            <Search size={14} color="#94A3B8" />
            <input placeholder="Cari nama / sertifikat…" value={q} onChange={e => setQ(e.target.value)} style={{ border: "none", outline: "none", fontSize: 13 }} />
          </div>
          <button onClick={() => setPage("upload")} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <Plus size={15} /> Tambah Sertifikat
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 18px 12px" }}>
        {["Semua", "Aktif", "Akan Expired", "Expired", "Menunggu Verifikasi"].map(f => (
          <div key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: filter === f ? "#2563EB" : "#F1F5F9", color: filter === f ? "white" : "#475569" }}>{f}</div>
        ))}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F8FAFC", color: "#64748B", textAlign: "left" }}>
            {["Nama Karyawan", "Divisi", "Jenis Sertifikat", "No. Sertifikat", "Tgl Expired", "Status", "Verifikasi", "Aksi"].map(h => <th key={h} style={{ padding: "10px 14px", fontWeight: 600 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id} style={{ borderTop: "1px solid #F1F5F9" }}>
              <td style={{ padding: "10px 14px" }}>{c.employee.nama}</td>
              <td style={{ padding: "10px 14px" }}>{c.employee.divisi}</td>
              <td style={{ padding: "10px 14px" }}>{c.jenis}</td>
              <td style={{ padding: "10px 14px" }}>{c.no}</td>
              <td style={{ padding: "10px 14px" }}>{fmtDate(c.expired)}</td>
              <td style={{ padding: "10px 14px" }}><Badge status={c.status} /></td>
              <td style={{ padding: "10px 14px" }}><Badge status={c.verifikasi} /></td>
              <td style={{ padding: "10px 14px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Eye size={15} color="#2563EB" style={{ cursor: "pointer" }} onClick={() => onDetail(c.id)} />
                  <Pencil size={14} color="#64748B" style={{ cursor: "pointer" }} onClick={() => onEdit(c.id)} />
                  <Trash2 size={15} color="#DC2626" style={{ cursor: "pointer" }} onClick={() => { if (confirm(`Hapus sertifikat ${c.jenis} milik ${c.employee.nama}?`)) onDelete(c.id); }} />
                  {canModerate && c.verifikasi === "Menunggu" && (
                    <>
                      <CheckCircle2 size={15} color="#16A34A" style={{ cursor: "pointer" }} title="Verifikasi" onClick={() => onVerify(c.id)} />
                      <XCircle size={15} color="#DC2626" style={{ cursor: "pointer" }} title="Tolak" onClick={() => onReject(c.id)} />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#94A3B8" }}>Tidak ada data.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function RejectModal({ onClose, onConfirm }) {
  const [note, setNote] = useState("");
  return (
    <Modal title="Tolak Sertifikat" onClose={onClose} width={440}>
      <Field label="Catatan revisi untuk karyawan">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={note} onChange={e => setNote(e.target.value)} placeholder="Jelaskan alasan penolakan agar karyawan tahu apa yang perlu diperbaiki…" />
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Batal</button>
        <button disabled={!note.trim()} onClick={() => onConfirm(note.trim())} style={{ background: note.trim() ? "#DC2626" : "#FCA5A5", color: "white", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: note.trim() ? "pointer" : "not-allowed" }}>Tolak & Kirim Notifikasi</button>
      </div>
    </Modal>
  );
}

function CertForm({ mode, employees, currentUser, initial, onSubmit, onError }) {
  const [form, setForm] = useState(initial ? {
    employeeId: initial.employeeId, jenis: initial.jenis, no: initial.no, lembaga: initial.lembaga,
    terbit: initial.terbit, expired: initial.expired, file: initial.file || "",
  } : { employeeId: employees[0]?.id || "", jenis: CERT_TYPES[0], no: "", lembaga: "", terbit: "", expired: "", file: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [fileError, setFileError] = useState("");

  const handleSubmit = () => {
    if (!form.employeeId || !form.jenis || !form.no || !form.lembaga || !form.terbit || !form.expired) {
      onError("Sertifikat gagal diupload: semua kolom bertanda * wajib diisi.");
      return;
    }
    if (!form.file) {
      setFileError("Silakan pilih file sertifikat (PDF, JPG, atau PNG, maks 5MB).");
      onError("Sertifikat gagal diupload: file sertifikat belum dilampirkan.");
      return;
    }
    if (new Date(form.expired) <= new Date(form.terbit)) {
      onError("Sertifikat gagal diupload: tanggal expired harus setelah tanggal terbit.");
      return;
    }
    const emp = employees.find(e => e.id === form.employeeId);
    if (mode === "create") {
      onSubmit({
        id: "C" + Date.now(), ...form, verifikasi: "Menunggu", catatan: "",
        riwayat: [{ tanggal: new Date().toISOString(), aksi: `Diupload oleh ${emp?.nama || currentUser.nama} (${currentUser.role === "Karyawan" ? "Karyawan" : currentUser.role})` }],
      });
    } else {
      onSubmit({
        ...initial, ...form, verifikasi: "Menunggu", catatan: "",
        riwayat: [...(initial.riwayat || []), { tanggal: new Date().toISOString(), aksi: `Diupload ulang oleh ${currentUser.nama} (revisi)` }],
      });
    }
  };

  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 24, maxWidth: 640 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{mode === "create" ? "Upload Sertifikat" : "Edit / Upload Ulang Sertifikat"}</div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>{mode === "create" ? "Unggah sertifikat yang diterima karyawan setelah mengikuti pelatihan" : "Perbarui data sertifikat. Setelah disimpan, status verifikasi akan direset menjadi Menunggu."}</div>
      <Field label="Karyawan *">
        <select style={inputStyle} value={form.employeeId} onChange={e => set("employeeId", e.target.value)}>
          {employees.map(e => <option key={e.id} value={e.id}>{e.nama} — {e.jabatan}</option>)}
        </select>
      </Field>
      <Field label="Jenis Sertifikat *">
        <select style={inputStyle} value={form.jenis} onChange={e => set("jenis", e.target.value)}>
          {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}><Field label="No. Sertifikat *"><input style={inputStyle} value={form.no} onChange={e => set("no", e.target.value)} placeholder="Masukkan nomor sertifikat" /></Field></div>
        <div style={{ flex: 1 }}><Field label="Lembaga Penerbit *"><input style={inputStyle} value={form.lembaga} onChange={e => set("lembaga", e.target.value)} placeholder="Masukkan lembaga penerbit" /></Field></div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}><Field label="Tanggal Terbit *"><input type="date" style={inputStyle} value={form.terbit} onChange={e => set("terbit", e.target.value)} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Tanggal Expired *"><input type="date" style={inputStyle} value={form.expired} onChange={e => set("expired", e.target.value)} /></Field></div>
      </div>
      <Field label="Upload File Sertifikat *" error={fileError}>
        <label style={{ display: "block", border: "2px dashed #CBD5E1", borderRadius: 10, padding: "22px 14px", textAlign: "center", cursor: "pointer", background: "#F8FAFC" }}>
          <UploadCloud size={22} color="#94A3B8" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 13, color: "#475569" }}>{form.file ? form.file : "Klik untuk memilih file sertifikat"}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Format: PDF, JPG, PNG (Maks 5MB)</div>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => {
            const f = e.target.files[0];
            if (!f) return;
            if (f.size > 5 * 1024 * 1024) { setFileError("Ukuran file melebihi 5MB. Silakan pilih file lain."); return; }
            setFileError(""); set("file", f.name);
          }} />
        </label>
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
        <button onClick={handleSubmit} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {mode === "create" ? "Submit" : "Simpan & Kirim Ulang"}
        </button>
      </div>
    </div>
  );
}

function DetailSertifikat({ cert, onBack }) {
  if (!cert) return <div>Sertifikat tidak ditemukan.</div>;
  return (
    <div>
      <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 13, cursor: "pointer", marginBottom: 14 }}>
        <span>←</span> Kembali
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 18, width: 280, textAlign: "center" }}>
          <div style={{ background: "#F1F5F9", borderRadius: 10, padding: "34px 10px", marginBottom: 12 }}>
            <FileBadge size={40} color="#94A3B8" style={{ margin: "0 auto 8px" }} />
            <div style={{ fontSize: 12, color: "#64748B", wordBreak: "break-all" }}>{cert.file || "sertifikat.pdf"}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, alignItems: "center", color: "#64748B", fontSize: 11, marginBottom: 6 }}>
            <QrCode size={14} /> Scan untuk verifikasi
          </div>
          <button style={{ width: "100%", background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Download size={14} /> Download
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{cert.jenis}</div>
              <div style={{ display: "flex", gap: 6 }}><Badge status={cert.status} /><Badge status={cert.verifikasi} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 12, columnGap: 20, fontSize: 13 }}>
              <div><div style={{ color: "#94A3B8", fontSize: 11.5 }}>Karyawan</div><div style={{ fontWeight: 500 }}>{cert.employee.nama}</div></div>
              <div><div style={{ color: "#94A3B8", fontSize: 11.5 }}>Divisi / Jabatan</div><div style={{ fontWeight: 500 }}>{cert.employee.divisi} · {cert.employee.jabatan}</div></div>
              <div><div style={{ color: "#94A3B8", fontSize: 11.5 }}>No. Sertifikat</div><div style={{ fontWeight: 500 }}>{cert.no}</div></div>
              <div><div style={{ color: "#94A3B8", fontSize: 11.5 }}>Lembaga Penerbit</div><div style={{ fontWeight: 500 }}>{cert.lembaga}</div></div>
              <div><div style={{ color: "#94A3B8", fontSize: 11.5 }}>Tanggal Terbit</div><div style={{ fontWeight: 500 }}>{fmtDate(cert.terbit)}</div></div>
              <div><div style={{ color: "#94A3B8", fontSize: 11.5 }}>Tanggal Expired</div><div style={{ fontWeight: 500 }}>{fmtDate(cert.expired)}</div></div>
            </div>
            {cert.verifikasi === "Ditolak" && (
              <div style={{ marginTop: 14, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 12px", fontSize: 12.5, color: "#B91C1C" }}>
                <b>Catatan revisi:</b> {cert.catatan}
              </div>
            )}
          </div>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Riwayat Verifikasi</div>
            {(cert.riwayat || []).map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, padding: "7px 0", borderBottom: i < cert.riwayat.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <Clock3 size={13} color="#94A3B8" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: "#334155" }}>{r.aksi}</div>
                  <div style={{ color: "#94A3B8", fontSize: 11 }}>{fmtDateTime(r.tanggal)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Karyawan({ employees, setEmployees, certs }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ nama: "", divisi: DIVISIONS[0], jabatan: JABATAN[0] });
  const countCerts = (id) => certs.filter(c => c.employeeId === id).length;
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7" }}>
      <div style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Data Karyawan</div>
        <button onClick={() => setAdding(a => !a)} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <Plus size={15} /> Tambah Karyawan
        </button>
      </div>
      {adding && (
        <div style={{ padding: "0 18px 16px", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><Field label="Nama"><input style={inputStyle} value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Divisi"><select style={inputStyle} value={form.divisi} onChange={e => setForm(f => ({ ...f, divisi: e.target.value }))}>{DIVISIONS.map(d => <option key={d}>{d}</option>)}</select></Field></div>
          <div style={{ flex: 1 }}><Field label="Jabatan"><select style={inputStyle} value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))}>{JABATAN.map(d => <option key={d}>{d}</option>)}</select></Field></div>
          <button onClick={() => { if (!form.nama) return; setEmployees(prev => [...prev, { id: "E" + Date.now(), ...form }]); setForm({ nama: "", divisi: DIVISIONS[0], jabatan: JABATAN[0] }); setAdding(false); }} style={{ background: "#16A34A", color: "white", border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>Simpan</button>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F8FAFC", color: "#64748B", textAlign: "left" }}>
            {["Nama", "Divisi", "Jabatan", "Jumlah Sertifikat", ""].map(h => <th key={h} style={{ padding: "10px 14px", fontWeight: 600 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id} style={{ borderTop: "1px solid #F1F5F9" }}>
              <td style={{ padding: "10px 14px" }}>{e.nama}</td>
              <td style={{ padding: "10px 14px" }}>{e.divisi}</td>
              <td style={{ padding: "10px 14px" }}>{e.jabatan}</td>
              <td style={{ padding: "10px 14px" }}>{countCerts(e.id)}</td>
              <td style={{ padding: "10px 14px" }}><Trash2 size={15} color="#DC2626" style={{ cursor: "pointer" }} onClick={() => setEmployees(prev => prev.filter(x => x.id !== e.id))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RequirementMatrix({ matrix, setMatrix }) {
  const toggle = (jab, jenis) => setMatrix(prev => { const row = { ...(prev[jab] || {}) }; row[jenis] = !row[jenis]; return { ...prev, [jab]: row }; });
  const uniqueJabatan = JABATAN.filter((j, i) => JABATAN.indexOf(j) === i);
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 18 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Requirement Matrix</div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Klik sel untuk mengubah wajib / tidak wajib per jabatan</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", color: "#64748B", textAlign: "left" }}>
              <th style={{ padding: "10px 14px" }}>Jabatan</th>
              {CERT_TYPES.map(t => <th key={t} style={{ padding: "10px 10px", textAlign: "center", fontSize: 12 }}>{t}</th>)}
            </tr>
          </thead>
          <tbody>
            {uniqueJabatan.map(jab => (
              <tr key={jab} style={{ borderTop: "1px solid #F1F5F9" }}>
                <td style={{ padding: "10px 14px", fontWeight: 500 }}>{jab}</td>
                {CERT_TYPES.map(t => {
                  const wajib = !!matrix[jab]?.[t];
                  return <td key={t} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => toggle(jab, t)}>{wajib ? <Check size={16} color="#16A34A" style={{ margin: "0 auto" }} /> : <Minus size={14} color="#CBD5E1" style={{ margin: "0 auto" }} />}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Mutasi({ employees, setEmployees, mutations, setMutations, matrix, certs }) {
  const [form, setForm] = useState({ employeeId: employees[0]?.id || "", jabatanBaru: JABATAN[0], divisiBaru: DIVISIONS[0] });
  const requiredFor = (jab) => Object.keys(matrix[jab] || {}).filter(k => matrix[jab][k]);
  const submit = () => {
    const emp = employees.find(e => e.id === form.employeeId);
    if (!emp) return;
    const jabatanLama = emp.jabatan, divisiLama = emp.divisi;
    const required = requiredFor(form.jabatanBaru);
    const owned = certs.filter(c => c.employeeId === emp.id && c.verifikasi === "Terverifikasi").map(c => c.jenis);
    const gap = required.filter(r => !owned.includes(r));
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, jabatan: form.jabatanBaru, divisi: form.divisiBaru } : e));
    setMutations(prev => [{ id: "M" + Date.now(), tanggal: new Date().toISOString().slice(0, 10), nama: emp.nama, jabatanLama, jabatanBaru: form.jabatanBaru, divisiLama, divisiBaru: form.divisiBaru, gap }, ...prev]);
  };
  return (
    <div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Ajukan Perpindahan Jabatan / Divisi</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><Field label="Karyawan"><select style={inputStyle} value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}>{employees.map(e => <option key={e.id} value={e.id}>{e.nama}</option>)}</select></Field></div>
          <div style={{ flex: 1 }}><Field label="Jabatan Baru"><select style={inputStyle} value={form.jabatanBaru} onChange={e => setForm(f => ({ ...f, jabatanBaru: e.target.value }))}>{JABATAN.map(j => <option key={j}>{j}</option>)}</select></Field></div>
          <div style={{ flex: 1 }}><Field label="Divisi Baru"><select style={inputStyle} value={form.divisiBaru} onChange={e => setForm(f => ({ ...f, divisiBaru: e.target.value }))}>{DIVISIONS.map(d => <option key={d}>{d}</option>)}</select></Field></div>
          <button onClick={submit} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>Proses Mutasi</button>
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7" }}>
        <div style={{ padding: 18, fontWeight: 700, fontSize: 16 }}>Riwayat Perpindahan Karyawan</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "#F8FAFC", color: "#64748B", textAlign: "left" }}>{["Tanggal", "Nama", "Jabatan Lama", "Jabatan Baru", "Impact Sertifikasi"].map(h => <th key={h} style={{ padding: "10px 14px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
          <tbody>
            {mutations.map(m => (
              <tr key={m.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                <td style={{ padding: "10px 14px" }}>{fmtDate(m.tanggal)}</td>
                <td style={{ padding: "10px 14px" }}>{m.nama}</td>
                <td style={{ padding: "10px 14px" }}>{m.jabatanLama}</td>
                <td style={{ padding: "10px 14px" }}>{m.jabatanBaru}</td>
                <td style={{ padding: "10px 14px" }}>{m.gap.length === 0 ? <span style={{ color: "#16A34A", fontWeight: 600 }}>Tidak diperlukan</span> : <span style={{ color: "#D97706", fontWeight: 600 }}>Perlu sertifikasi: {m.gap.join(", ")}</span>}</td>
              </tr>
            ))}
            {mutations.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94A3B8" }}>Belum ada riwayat perpindahan.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Notifikasi({ certs, settings }) {
  const verified = certs.filter(c => c.verifikasi === "Terverifikasi");
  const pending = certs.filter(c => c.verifikasi === "Menunggu");
  const groups = [
    { label: "3 Bulan", filter: c => c.days >= 60 && c.days <= 90, color: "#2563EB" },
    { label: "1 Bulan", filter: c => c.days >= 20 && c.days < 60, color: "#D97706" },
    { label: "7 Hari", filter: c => c.days >= 0 && c.days < 20, color: "#DC2626" },
    { label: "Expired", filter: c => c.days < 0, color: "#DC2626" },
  ];
  const anyReminder = verified.some(c => groups.some(g => g.filter(c)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {settings.emailNotif && (
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#1D4ED8", display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={15} /> Notifikasi di bawah ini juga otomatis dikirim melalui email ke masing-masing karyawan.
        </div>
      )}
      {pending.length > 0 && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#2563EB", marginBottom: 10 }}>Menunggu Verifikasi ({pending.length})</div>
          {pending.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: "#F8FAFC", borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
              <div><b>{c.jenis}</b> — {c.employee.nama}</div>
              <span style={{ color: "#94A3B8", fontSize: 11 }}>{c.employee ? slugEmail(c.employee.nama) : ""}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Pengingat Sertifikat</div>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Notifikasi otomatis berdasarkan masa berlaku sertifikat</div>
        {groups.map(g => {
          const items = verified.filter(g.filter);
          if (items.length === 0) return null;
          return (
            <div key={g.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: g.color, marginBottom: 6 }}>{g.label}</div>
              {items.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: "#F8FAFC", borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                  <div><b>{c.jenis}</b> — {c.employee.nama}</div>
                  <div style={{ color: g.color, fontWeight: 600 }}>{c.days < 0 ? `Expired ${Math.abs(c.days)} hari lalu` : `${c.days} hari lagi`}</div>
                </div>
              ))}
            </div>
          );
        })}
        {!anyReminder && <div style={{ color: "#94A3B8" }}>Tidak ada sertifikat yang perlu diperhatikan saat ini.</div>}
      </div>
    </div>
  );
}

function Pengaturan({ settings, setSettings, currentUser, users, showToast }) {
  const [profile, setProfile] = useState({ nama: currentUser.nama, email: currentUser.email });
  const [pw, setPw] = useState({ baru: "", konfirmasi: "" });
  const toggleDay = (d) => setSettings(s => ({ ...s, reminderDays: s.reminderDays.includes(d) ? s.reminderDays.filter(x => x !== d) : [...s.reminderDays, d].sort((a, b) => b - a) }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Profil Saya</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1 }}><Field label="Nama Lengkap"><input style={inputStyle} value={profile.nama} onChange={e => setProfile(p => ({ ...p, nama: e.target.value }))} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Email"><input style={inputStyle} value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></Field></div>
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>Peran: <b>{currentUser.role}</b></div>
        <button onClick={() => showToast("success", "Profil berhasil diperbarui.")} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Simpan Profil</button>
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Ubah Kata Sandi</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1 }}><Field label="Kata Sandi Baru"><input type="password" style={inputStyle} value={pw.baru} onChange={e => setPw(p => ({ ...p, baru: e.target.value }))} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Konfirmasi Kata Sandi"><input type="password" style={inputStyle} value={pw.konfirmasi} onChange={e => setPw(p => ({ ...p, konfirmasi: e.target.value }))} /></Field></div>
        </div>
        <button onClick={() => {
          if (pw.baru.length < 6) { showToast("error", "Kata sandi minimal 6 karakter."); return; }
          if (pw.baru !== pw.konfirmasi) { showToast("error", "Konfirmasi kata sandi tidak cocok."); return; }
          setPw({ baru: "", konfirmasi: "" }); showToast("success", "Kata sandi berhasil diubah.");
        }} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ubah Kata Sandi</button>
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Preferensi Notifikasi</div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={settings.emailNotif} onChange={e => setSettings(s => ({ ...s, emailNotif: e.target.checked }))} />
          Kirim notifikasi pengingat sertifikat melalui email
        </label>
        <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Kirim pengingat pada:</div>
        <div style={{ display: "flex", gap: 16 }}>
          {[90, 30, 7].map(d => (
            <label key={d} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={settings.reminderDays.includes(d)} onChange={() => toggleDay(d)} /> {d} hari sebelum expired
            </label>
          ))}
        </div>
      </div>

      {(currentUser.role === "HSE Admin" || currentUser.role === "HRD") && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #EEF2F7", padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Manajemen Pengguna</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#F8FAFC", color: "#64748B", textAlign: "left" }}><th style={{ padding: "8px 10px" }}>Nama</th><th style={{ padding: "8px 10px" }}>Email</th><th style={{ padding: "8px 10px" }}>Peran</th></tr></thead>
            <tbody>{users.map(u => <tr key={u.id} style={{ borderTop: "1px solid #F1F5F9" }}><td style={{ padding: "8px 10px" }}>{u.nama}</td><td style={{ padding: "8px 10px" }}>{u.email}</td><td style={{ padding: "8px 10px" }}><Badge status={u.role} /></td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
