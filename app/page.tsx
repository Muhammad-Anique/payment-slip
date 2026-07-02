"use client";

import { useState, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SlipData {
  // Branding
  showCompanyName: boolean;
  companyName: string;
  companyTagline: string;
  taglineMaxWidth: string;
  headerSpacing: string;
  logoUrl: string;
  brandColor: string;
  bannerBgColor: string;
  // Invoice details
  receiptNumber: string;
  date: string;
  dueDate: string;
  showDay: boolean;
  currency: string;
  amount: string;
  bonus: string;
  includeBonus: boolean;
  perks: string;
  includePerks: boolean;
  paymentMethod: string;
  referenceId: string;
  description: string;
  // Payer
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  payerAddress: string;
  addressMaxWidth: string;
  // Payee (contractor — you)
  payeeName: string;
  payeeEmail: string;
  payeePhone: string;
  payeeAddress: string;
  payeeBank: string;
  showPaidBadge: boolean;
  // Bank / payment instructions
  showBankDetails: boolean;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIban: string;
  bankSwift: string;
  // Signature & footer
  signatoryName: string;
  signatoryTitle: string;
  showSignatureLine: boolean;
  footerNote: string;
}

const today = new Date().toISOString().split("T")[0];

// Quick Prefill holds personal invoice history — only shown when running
// locally (`npm run dev`). It is never rendered in the deployed production build.
const IS_LOCAL = process.env.NODE_ENV === "development";

const OMNIGPT_LOGO = "data:image/png;base64,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";

const DEFAULT: SlipData = {
  showCompanyName: false,
  companyName: "OmniGPT",
  companyTagline: "Seamlessly integrate AI into your life and work through OmniGPT.",
  taglineMaxWidth: "280",
  headerSpacing: "4",
  logoUrl: OMNIGPT_LOGO,
  brandColor: "#000224",
  bannerBgColor: "#f0fff9",
  receiptNumber: "INV-001",
  date: today,
  dueDate: "",
  showDay: true,
  currency: "USD",
  amount: "700",
  bonus: "0.00",
  includeBonus: false,
  perks: "0.00",
  includePerks: false,
  showPaidBadge: true,
  paymentMethod: "Wise Transfer",
  referenceId: "WISE-XXXXXXXX",
  description: "Monthly Salary",
  payerName: "Omnigpt Ltd",
  payerEmail: "support@omnigpt.co",
  payerPhone: "",
  payerAddress: "Bangkok, Thailand",
  addressMaxWidth: "200",
  payeeName: "Muhammad Anique",
  payeeEmail: "anique.cs@gmail.com",
  payeePhone: "+923204589040",
  payeeAddress: "G.T Road, Kharian\nGujrat, Punjab 50090\nPakistan",
  payeeBank: "",
  showBankDetails: true,
  bankAccountName: "Muhammad Anique",
  bankName: "Meezan Bank",
  bankAccountNumber: "",
  bankIban: "PK28MEZN0067010111081882",
  bankSwift: "",
  signatoryName: "",
  signatoryTitle: "Authorized Signatory",
  showSignatureLine: true,
  footerNote: "This is an official payment receipt. Please retain for your records.",
};

// ── Presets ───────────────────────────────────────────────────────────────────

interface Preset {
  label: string;
  receiptNumber: string;
  date: string;
  amount: string;
  bonus: string;
  includeBonus: boolean;
  description: string;
}

const PRESETS: Preset[] = [
  { label: "INV-0001 · May 6, 2025 · Upwork ($520)",          receiptNumber: "INV-0001", date: "2025-05-06", amount: "520",  bonus: "0.00", includeBonus: false, description: "Hourly Contract - Upwork" },
  { label: "INV-0002 · Jun 2, 2025 · Salary ($700)",          receiptNumber: "INV-0002", date: "2025-06-02", amount: "700",  bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0003 · Jul 4, 2025 · Salary ($700)",          receiptNumber: "INV-0003", date: "2025-07-04", amount: "700",  bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0004 · Aug 12, 2025 · Salary ($700)",         receiptNumber: "INV-0004", date: "2025-08-12", amount: "700",  bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0005 · Sep 8, 2025 · Salary + Bonus ($1,650)",receiptNumber: "INV-0005", date: "2025-09-08", amount: "1200", bonus: "450",  includeBonus: true,  description: "Monthly Salary" },
  { label: "INV-0006 · Oct 8, 2025 · Salary + Bonus ($1,650)",receiptNumber: "INV-0006", date: "2025-10-08", amount: "1200", bonus: "450",  includeBonus: true,  description: "Monthly Salary" },
  { label: "INV-0007 · Nov 5, 2025 · Salary ($1,200)",        receiptNumber: "INV-0007", date: "2025-11-05", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0008 · Dec 4, 2025 · Salary ($1,200)",        receiptNumber: "INV-0008", date: "2025-12-04", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0009 · Jan 5, 2026 · Salary ($1,200)",        receiptNumber: "INV-0009", date: "2026-01-05", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0010 · Feb 4, 2026 · Salary ($1,200)",        receiptNumber: "INV-0010", date: "2026-02-04", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0011 · Mar 4, 2026 · Salary ($1,200)",        receiptNumber: "INV-0011", date: "2026-03-04", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0012 · Apr 3, 2026 · Salary ($1,200)",        receiptNumber: "INV-0012", date: "2026-04-03", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
  { label: "INV-0013 · May 8, 2026 · Salary ($1,200)",        receiptNumber: "INV-0013", date: "2026-05-08", amount: "1200", bonus: "0.00", includeBonus: false, description: "Monthly Salary" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNum(v: string) {
  return parseFloat((v || "0").replace(/,/g, "")) || 0;
}

function fmt(amount: string | number, currency: string) {
  const num = typeof amount === "string" ? parseNum(amount) : amount;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
}

function ordinal(n: number) {
  const v = n % 100;
  return n + (["th","st","nd","rd"][(v - 20) % 10] ?? ["th","st","nd","rd"][v] ?? "th");
}

function fmtDate(dateStr: string, showDay = false) {
  if (!dateStr) return "";
  try {
    const dt = new Date(dateStr + "T00:00:00");
    if (isNaN(dt.getTime())) return dateStr;
    const month = dt.toLocaleDateString("en-US", { month: "long" });
    const year = dt.getFullYear();
    const day = ordinal(dt.getDate());
    if (showDay) {
      const weekday = dt.toLocaleDateString("en-US", { weekday: "short" });
      return `${weekday}, ${month} ${day}, ${year}`;
    }
    return `${month} ${day}, ${year}`;
  } catch {
    return dateStr;
  }
}

// ── SlipPreview ────────────────────────────────────────────────────────────────

function SlipPreview({ d }: { d: SlipData }) {
  const color = d.brandColor || "#6366f1";
  const subtotal = parseNum(d.amount);
  const bonus = d.includeBonus ? parseNum(d.bonus) : 0;
  const perks = d.includePerks ? parseNum(d.perks) : 0;
  const total = subtotal + bonus + perks;

  return (
    <div
      className="bg-white w-full flex flex-col"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", minHeight: "297mm" }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-12 py-8" style={{ backgroundColor: color }}>
        <div className="flex items-start justify-between">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: `${parseInt(d.headerSpacing) || 4}px` }}>
            {d.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.logoUrl} alt="logo" className="h-10 object-contain" />
            )}
            {d.showCompanyName && (
              <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {d.companyName || "Company Name"}
              </h1>
            )}
            {d.companyTagline && (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)", maxWidth: `${parseInt(d.taglineMaxWidth) || 280}px` }}>
                {d.companyTagline}
              </p>
            )}
          </div>
          <div className="text-right">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em" }}
            >
              Invoice
            </p>
            <p className="text-white text-2xl font-bold mt-1">{d.receiptNumber || "—"}</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
              {fmtDate(d.date, d.showDay)}
            </p>
            {d.dueDate && (
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                Due: {fmtDate(d.dueDate, false)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Amount banner ───────────────────────────────── */}
      <div className="px-12 py-8 border-b border-gray-100" style={{ backgroundColor: d.bannerBgColor || `${color}10` }}>
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#9ca3af", letterSpacing: "0.12em" }}
            >
              Amount Due
            </p>
            <p className="text-5xl font-bold text-gray-900 leading-none">{fmt(total, d.currency)}</p>
            {d.paymentMethod && (
              <p className="text-sm text-gray-400 mt-2">Pay via {d.paymentMethod}</p>
            )}
            {d.referenceId && (
              <p className="text-xs text-gray-400 mt-1">
                Ref:{" "}
                <span className="font-mono" style={{ color: "#6b7280" }}>
                  {d.referenceId}
                </span>
              </p>
            )}
          </div>
          {d.showPaidBadge && (
            <div
              className="text-sm font-bold tracking-widest uppercase px-6 py-2 border-4"
              style={{ color, borderColor: color, borderRadius: 4 }}
            >
              PAID
            </div>
          )}
        </div>
      </div>

      {/* ── Payer / Payee ────────────────────────────────── */}
      <div className="px-12 py-5 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1.5 border-b border-gray-100"
              style={{ color: "#9ca3af" }}
            >
              Bill To
            </p>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-0.5 text-gray-400 w-20">Name</td>
                  <td className="py-0.5 font-semibold text-gray-800">{d.payerName || "—"}</td>
                </tr>
                {d.payerEmail && (
                  <tr>
                    <td className="py-0.5 text-gray-400">Email</td>
                    <td className="py-0.5 text-gray-600">{d.payerEmail}</td>
                  </tr>
                )}
                {d.payerPhone && (
                  <tr>
                    <td className="py-0.5 text-gray-400">Phone</td>
                    <td className="py-0.5 text-gray-600">{d.payerPhone}</td>
                  </tr>
                )}
                {d.payerAddress && (
                  <tr>
                    <td className="py-0.5 text-gray-400 align-top">Address</td>
                    <td className="py-0.5 text-gray-500 whitespace-pre-line" style={{ maxWidth: `${parseInt(d.addressMaxWidth) || 200}px` }}>{d.payerAddress}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1.5 border-b border-gray-100"
              style={{ color: "#9ca3af" }}
            >
              From
            </p>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-0.5 text-gray-400 w-20">Name</td>
                  <td className="py-0.5 font-semibold text-gray-800">{d.payeeName || "—"}</td>
                </tr>
                {d.payeeEmail && (
                  <tr>
                    <td className="py-0.5 text-gray-400">Email</td>
                    <td className="py-0.5 text-gray-600">{d.payeeEmail}</td>
                  </tr>
                )}
                {d.payeePhone && (
                  <tr>
                    <td className="py-0.5 text-gray-400">Phone</td>
                    <td className="py-0.5 text-gray-600">{d.payeePhone}</td>
                  </tr>
                )}
                {d.payeeAddress && (
                  <tr>
                    <td className="py-0.5 text-gray-400 align-top">Address</td>
                    <td className="py-0.5 text-gray-500 whitespace-pre-line" style={{ maxWidth: `${parseInt(d.addressMaxWidth) || 200}px` }}>{d.payeeAddress}</td>
                  </tr>
                )}
                {d.payeeBank && (
                  <tr>
                    <td className="py-0.5 text-gray-400">Bank</td>
                    <td className="py-0.5 text-gray-500">{d.payeeBank}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Payment Breakdown ────────────────────────────── */}
      <div className="px-12 py-7 border-b border-gray-100">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "#9ca3af", letterSpacing: "0.12em" }}
        >
          Payment Breakdown
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #f2f2f2" }}>
              <th className="text-left py-2 font-semibold text-gray-500">Description</th>
              <th className="text-right py-2 font-semibold text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
              <td className="py-2 text-gray-700">{d.description || "—"}</td>
              <td className="py-2 text-right text-gray-800 font-medium">{fmt(d.amount, d.currency)}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
              <td className="py-2 text-gray-500">Subtotal</td>
              <td className="py-2 text-right text-gray-700">{fmt(subtotal, d.currency)}</td>
            </tr>
            {d.includeBonus && (
              <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
                <td className="py-2 text-gray-500">Bonus</td>
                <td className="py-2 text-right text-gray-700">{fmt(bonus, d.currency)}</td>
              </tr>
            )}
            {d.includePerks && (
              <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
                <td className="py-2 text-gray-500">Perks</td>
                <td className="py-2 text-right text-gray-700">{fmt(perks, d.currency)}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "1px solid #eeeeee" }}>
              <td className="pt-3 pb-1 font-bold text-gray-900">Total</td>
              <td className="pt-3 pb-1 text-right font-bold text-gray-900 text-base">
                {fmt(total, d.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Bank / Payment Instructions ─────────────────── */}
      {d.showBankDetails && (d.bankAccountName || d.bankName || d.bankAccountNumber || d.bankIban || d.bankSwift) && (
        <div className="px-12 py-4 border-b border-gray-100">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#9ca3af", letterSpacing: "0.12em" }}
          >
            Payment Instructions
          </p>
          <table className="w-full" style={{ fontSize: "12px" }}>
            <tbody>
              {d.bankAccountName && (
                <tr>
                  <td className="py-0.5 text-gray-400 w-36">Account Name</td>
                  <td className="py-0.5 font-semibold text-gray-800">{d.bankAccountName}</td>
                </tr>
              )}
              {d.bankName && (
                <tr>
                  <td className="py-0.5 text-gray-400">Bank</td>
                  <td className="py-0.5 text-gray-700">{d.bankName}</td>
                </tr>
              )}
              {d.bankAccountNumber && (
                <tr>
                  <td className="py-0.5 text-gray-400">Account No.</td>
                  <td className="py-0.5 font-mono text-gray-700">{d.bankAccountNumber}</td>
                </tr>
              )}
              {d.bankIban && (
                <tr>
                  <td className="py-0.5 text-gray-400">IBAN</td>
                  <td className="py-0.5 font-mono text-gray-700">{d.bankIban}</td>
                </tr>
              )}
              {d.bankSwift && (
                <tr>
                  <td className="py-0.5 text-gray-400">Swift / BIC</td>
                  <td className="py-0.5 font-mono text-gray-700">{d.bankSwift}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Signature ────────────────────────────────────── */}
      {d.showSignatureLine && (
        <div className="px-12 pt-14 pb-4">
          <div className="flex justify-end">
            <div className="text-center" style={{ minWidth: 200 }}>
              <div className="border-b-2 border-gray-300 mb-2" style={{ height: 44 }} />
              <p className="text-sm font-semibold text-gray-800">
                {d.signatoryName || d.companyName || "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{d.signatoryTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Spacer ───────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="px-12 py-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center">{d.footerNote}</p>
      </div>
    </div>
  );
}

// ── Form helpers ───────────────────────────────────────────────────────────────

// ── Accordion ──────────────────────────────────────────────────────────────────

function Accordion({
  title,
  icon,
  hint,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  hint?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border transition-colors ${open ? "border-indigo-200 bg-white shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-sm">{icon}</span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{title}</span>
            {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
          </span>
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition";

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputCls}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={inputCls + " resize-none"}
    />
  );
}

// ── Preset logos available from /public ───────────────────────────────────────

const PRESET_LOGOS = [
  { label: "Globe", src: "/globe.svg" },
  { label: "Next.js", src: "/next.svg" },
  { label: "Vercel", src: "/vercel.svg" },
  { label: "Window", src: "/window.svg" },
  { label: "File", src: "/file.svg" },
];

// ── LogoPicker ────────────────────────────────────────────────────────────────

function LogoPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [onChange]);

  return (
    <div className="space-y-2">
      {/* URL input */}
      <Input value={value} onChange={onChange} placeholder="https://… or upload below" />

      {/* Actions row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition cursor-pointer"
        >
          Upload file (SVG / PNG / JPG)
        </button>
        <button
          type="button"
          onClick={() => setShowPresets((p) => !p)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition cursor-pointer"
        >
          Presets
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-red-400 hover:border-red-300 transition cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {/* Preset grid */}
      {showPresets && (
        <div className="grid grid-cols-5 gap-1.5 p-2 rounded-lg border border-gray-100 bg-gray-50">
          {PRESET_LOGOS.map((p) => (
            <button
              key={p.src}
              type="button"
              title={p.label}
              onClick={() => { onChange(p.src); setShowPresets(false); }}
              className={`flex flex-col items-center gap-1 rounded-md p-1.5 text-xs transition cursor-pointer ${
                value === p.src
                  ? "bg-indigo-50 ring-1 ring-indigo-300 text-indigo-600"
                  : "hover:bg-white text-gray-500 hover:text-gray-800"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.label} className="h-6 w-6 object-contain" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Current logo preview */}
      {value && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="logo preview" className="h-8 object-contain" />
          <span className="text-xs text-gray-400 truncate">{value.startsWith("data:") ? "Uploaded file" : value}</span>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const [d, setD] = useState<SlipData>(DEFAULT);
  const previewRef = useRef<HTMLDivElement>(null);

  const SECTIONS = ["Branding", "Invoice Details", "Bill To", "From", "Bank", "Signature"] as const;
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["Branding", "Invoice Details"])
  );

  function toggleSection(name: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  const allOpen = openSections.size === SECTIONS.length;
  function toggleAll() {
    setOpenSections(allOpen ? new Set() : new Set(SECTIONS));
  }

  function set<K extends keyof SlipData>(key: K, value: SlipData[K]) {
    setD((prev) => ({ ...prev, [key]: value }));
  }

  function handlePrint() {
    const el = previewRef.current;
    if (!el) return;
    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 100%; background: #fff; font-family: Arial, Helvetica, sans-serif; }
      @page { size: A4; margin: 0; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
      table { border-collapse: collapse; width: 100%; }
      img { display: block; }
      /* layout */
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .flex-1 { flex: 1 1 0%; }
      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .gap-12 { gap: 3rem; }
      .gap-10 { gap: 2.5rem; }
      .gap-8  { gap: 2rem; }
      .items-start { align-items: flex-start; }
      .items-center { align-items: center; }
      .justify-between { justify-content: space-between; }
      .justify-end { justify-content: flex-end; }
      /* text */
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .text-left { text-align: left; }
      .align-top { vertical-align: top; }
      .whitespace-pre-line { white-space: pre-line; }
      .object-contain { object-fit: contain; }
      .uppercase { text-transform: uppercase; }
      .tracking-tight { letter-spacing: -0.025em; }
      .tracking-widest { letter-spacing: 0.1em; }
      .leading-tight { line-height: 1.25; }
      .leading-none { line-height: 1; }
      /* sizing */
      .w-full { width: 100%; }
      .w-36 { width: 9rem; }
      .w-20 { width: 5rem; }
      .h-10 { height: 2.5rem; }
      /* spacing */
      .px-12 { padding-left: 3rem; padding-right: 3rem; }
      .px-6  { padding-left: 1.5rem; padding-right: 1.5rem; }
      .px-5  { padding-left: 1.25rem; padding-right: 1.25rem; }
      .py-12 { padding-top: 3rem;    padding-bottom: 3rem; }
      .py-10 { padding-top: 2.5rem;  padding-bottom: 2.5rem; }
      .py-9  { padding-top: 2.25rem; padding-bottom: 2.25rem; }
      .py-8  { padding-top: 2rem;    padding-bottom: 2rem; }
      .py-7  { padding-top: 1.75rem; padding-bottom: 1.75rem; }
      .py-6  { padding-top: 1.5rem;  padding-bottom: 1.5rem; }
      .py-5  { padding-top: 1.25rem; padding-bottom: 1.25rem; }
      .py-4  { padding-top: 1rem;    padding-bottom: 1rem; }
      .py-3  { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
      .py-2  { padding-top: 0.5rem;  padding-bottom: 0.5rem; }
      .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
      .py-1  { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
      .pt-16 { padding-top: 4rem; }
      .pt-14 { padding-top: 3.5rem; }
      .pt-12 { padding-top: 3rem; }
      .pt-10 { padding-top: 2.5rem; }
      .pt-8  { padding-top: 2rem; }
      .pt-3  { padding-top: 0.75rem; }
      .pb-4  { padding-bottom: 1rem; }
      .pb-3  { padding-bottom: 0.75rem; }
      .pb-2  { padding-bottom: 0.5rem; }
      .pb-1  { padding-bottom: 0.25rem; }
      .mb-4  { margin-bottom: 1rem; }
      .mb-3  { margin-bottom: 0.75rem; }
      .mb-2  { margin-bottom: 0.5rem; }
      .mb-1  { margin-bottom: 0.25rem; }
      .mt-2  { margin-top: 0.5rem; }
      .mt-1  { margin-top: 0.25rem; }
      .mt-0\\.5 { margin-top: 0.125rem; }
      .mt-1\\.5 { margin-top: 0.375rem; }
      /* colors */
      .bg-white   { background-color: #ffffff; }
      .bg-gray-50 { background-color: #f9fafb; }
      .text-white    { color: #ffffff; }
      .text-gray-900 { color: #111827; }
      .text-gray-800 { color: #1f2937; }
      .text-gray-700 { color: #374151; }
      .text-gray-600 { color: #4b5563; }
      .text-gray-500 { color: #6b7280; }
      .text-gray-400 { color: #9ca3af; }
      /* borders — use longhand so color classes are never overridden by shorthand reset */
      .border-b   { border-bottom-width: 1px; border-bottom-style: solid; }
      .border-t   { border-top-width: 1px;    border-top-style: solid; }
      .border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
      .border-4   { border-width: 4px;        border-style: solid; }
      /* border colors — must come after width/style rules */
      .border-gray-300 { border-color: #efefef; }
      .border-gray-200 { border-color: #f5f5f5; }
      .border-gray-100 { border-color: #fafafa; }
      /* typography */
      .text-5xl { font-size: 3rem; line-height: 1; }
      .text-2xl { font-size: 1.5rem; line-height: 2rem; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .text-sm  { font-size: 0.875rem; line-height: 1.25rem; }
      .text-xs  { font-size: 0.75rem; line-height: 1rem; }
      .font-bold     { font-weight: 700; }
      .font-semibold { font-weight: 600; }
      .font-medium   { font-weight: 500; }
      .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    `;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Receipt – ${d.receiptNumber}</title>
      <style>${css}</style>
    </head><body>${el.outerHTML}<script>
      window.onload = function() { setTimeout(function(){ window.print(); window.close(); }, 250); };
      setTimeout(function(){ window.print(); window.close(); }, 1200);
    <\/script></body></html>`);
    win.document.close();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left: Form ── */}
      <div className="no-print w-full md:w-[360px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-gray-900">Payment Slip Generator</h1>
            <p className="text-xs text-gray-400 mt-0.5">Live preview updates as you type</p>
          </div>
          <button
            onClick={handlePrint}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: d.brandColor || "#6366f1" }}
          >
            Print / PDF
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {/* ── Quick Prefill (local dev only — hidden in production) ── */}
          {IS_LOCAL && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Quick Prefill · Local only</p>
              <select
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
                defaultValue=""
                onChange={(e) => {
                  const idx = parseInt(e.target.value);
                  if (isNaN(idx)) return;
                  const p = PRESETS[idx];
                  setD((prev) => ({
                    ...prev,
                    receiptNumber: p.receiptNumber,
                    date: p.date,
                    amount: p.amount,
                    bonus: p.bonus,
                    includeBonus: p.includeBonus,
                    description: p.description,
                  }));
                  e.target.value = "";
                }}
              >
                <option value="" disabled>Select an invoice to prefill…</option>
                {PRESETS.map((p, i) => (
                  <option key={p.receiptNumber} value={i}>{p.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── Expand / collapse all ── */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Sections</p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition cursor-pointer"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>

          <Accordion title="Branding" icon="🎨" hint="Logo, colors & tagline" open={openSections.has("Branding")} onToggle={() => toggleSection("Branding")}>
            <Field label="">
              <label className="flex items-center gap-2 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={d.showCompanyName}
                  onChange={(e) => set("showCompanyName", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show company name</span>
              </label>
              {d.showCompanyName && (
                <Input value={d.companyName} onChange={(v) => set("companyName", v)} placeholder="SuperStack Ltd" />
              )}
            </Field>
            <Field label="Tagline">
              <Input value={d.companyTagline} onChange={(v) => set("companyTagline", v)} placeholder="Digital Product Studio" />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tagline max width (px)">
                <Input type="number" value={d.taglineMaxWidth} onChange={(v) => set("taglineMaxWidth", v)} placeholder="280" />
              </Field>
              <Field label="Header spacing (px)">
                <Input type="number" value={d.headerSpacing} onChange={(v) => set("headerSpacing", v)} placeholder="4" />
              </Field>
            </div>
            <Field label="Logo">
              <LogoPicker value={d.logoUrl} onChange={(v) => set("logoUrl", v)} />
            </Field>
            <Field label="Brand color (header)">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={d.brandColor}
                  onChange={(e) => set("brandColor", e.target.value)}
                  className="h-9 w-14 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <Input value={d.brandColor} onChange={(v) => set("brandColor", v)} placeholder="#6366f1" />
              </div>
            </Field>
            <Field label="Amount banner color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={d.bannerBgColor}
                  onChange={(e) => set("bannerBgColor", e.target.value)}
                  className="h-9 w-14 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <Input value={d.bannerBgColor} onChange={(v) => set("bannerBgColor", v)} placeholder="#eef2ff" />
              </div>
            </Field>
          </Accordion>

          <Accordion title="Invoice Details" icon="🧾" hint="Number, date, amount & method" open={openSections.has("Invoice Details")} onToggle={() => toggleSection("Invoice Details")}>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Invoice #">
                <Input value={d.receiptNumber} onChange={(v) => set("receiptNumber", v)} placeholder="INV-001" />
              </Field>
              <Field label="Invoice Date">
                <Input value={d.date} onChange={(v) => set("date", v)} placeholder="e.g. 2026-05-12" />
                <label className="flex items-center gap-1.5 cursor-pointer mt-1.5">
                  <input
                    type="checkbox"
                    checked={d.showDay}
                    onChange={(e) => set("showDay", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-500">Show day</span>
                </label>
              </Field>
            </div>
            <Field label="Due Date">
              <Input value={d.dueDate} onChange={(v) => set("dueDate", v)} placeholder="e.g. 2026-06-12" />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Currency">
                <select
                  value={d.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className={inputCls}
                >
                  {["USD", "EUR", "GBP", "THB", "SGD", "AUD", "CAD", "JPY", "AED", "INR"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Amount">
                <Input value={d.amount} onChange={(v) => set("amount", v)} placeholder="0.00" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="">
                <label className="flex items-center gap-1.5 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={d.includeBonus}
                    onChange={(e) => set("includeBonus", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-500">Include Bonus</span>
                </label>
                <Input
                  value={d.bonus}
                  onChange={(v) => set("bonus", v)}
                  placeholder="0.00"
                />
              </Field>
              <Field label="">
                <label className="flex items-center gap-1.5 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={d.includePerks}
                    onChange={(e) => set("includePerks", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-500">Include Perks</span>
                </label>
                <Input
                  value={d.perks}
                  onChange={(v) => set("perks", v)}
                  placeholder="0.00"
                />
              </Field>
            </div>
            <Field label="">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={d.showPaidBadge}
                  onChange={(e) => set("showPaidBadge", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show PAID badge</span>
              </label>
            </Field>
            <Field label="Payment method">
              <Input value={d.paymentMethod} onChange={(v) => set("paymentMethod", v)} placeholder="Wise Transfer" />
            </Field>
            <Field label="Reference / Transaction ID">
              <Input value={d.referenceId} onChange={(v) => set("referenceId", v)} placeholder="WISE-XXXXXXXX" />
            </Field>
            <Field label="Description">
              <Textarea value={d.description} onChange={(v) => set("description", v)} placeholder="Freelance / contract payment" />
            </Field>
          </Accordion>

          <Accordion title="Bill To (Client)" icon="👤" hint="Who you're billing" open={openSections.has("Bill To")} onToggle={() => toggleSection("Bill To")}>
            <Field label="Name">
              <Input value={d.payerName} onChange={(v) => set("payerName", v)} placeholder="Client / Company name" />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Email">
                <Input value={d.payerEmail} onChange={(v) => set("payerEmail", v)} placeholder="client@example.com" type="email" />
              </Field>
              <Field label="Phone">
                <Input value={d.payerPhone} onChange={(v) => set("payerPhone", v)} placeholder="+1 555 000 0000" />
              </Field>
            </div>
            <Field label="Address">
              <Textarea value={d.payerAddress} onChange={(v) => set("payerAddress", v)} placeholder={"123 Main St\nCity, Country"} />
            </Field>
            <Field label="Address max width (px)">
              <Input type="number" value={d.addressMaxWidth} onChange={(v) => set("addressMaxWidth", v)} placeholder="200" />
            </Field>
          </Accordion>

          <Accordion title="From (You / Contractor)" icon="🏠" hint="Your details" open={openSections.has("From")} onToggle={() => toggleSection("From")}>
            <Field label="Name">
              <Input value={d.payeeName} onChange={(v) => set("payeeName", v)} placeholder="Your name" />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Email">
                <Input value={d.payeeEmail} onChange={(v) => set("payeeEmail", v)} placeholder="you@example.com" type="email" />
              </Field>
              <Field label="Phone">
                <Input value={d.payeePhone} onChange={(v) => set("payeePhone", v)} placeholder="+1 555 000 0000" />
              </Field>
            </div>
            <Field label="Address">
              <Textarea value={d.payeeAddress} onChange={(v) => set("payeeAddress", v)} placeholder={"123 Main St\nCity, Country"} />
            </Field>
          </Accordion>

          <Accordion title="Payment Instructions (Bank)" icon="🏦" hint="Account & IBAN" open={openSections.has("Bank")} onToggle={() => toggleSection("Bank")}>
            <Field label="">
              <label className="flex items-center gap-2 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={d.showBankDetails}
                  onChange={(e) => set("showBankDetails", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show bank details on invoice</span>
              </label>
            </Field>
            <Field label="Account name">
              <Input value={d.bankAccountName} onChange={(v) => set("bankAccountName", v)} placeholder="Your full name" />
            </Field>
            <Field label="Bank name">
              <Input value={d.bankName} onChange={(v) => set("bankName", v)} placeholder="e.g. Wise, HSBC" />
            </Field>
            <Field label="Account number">
              <Input value={d.bankAccountNumber} onChange={(v) => set("bankAccountNumber", v)} placeholder="XXXXXXXXXX" />
            </Field>
            <Field label="IBAN">
              <Input value={d.bankIban} onChange={(v) => set("bankIban", v)} placeholder="e.g. GB29 NWBK 6016 1331 9268 19" />
            </Field>
            <Field label="Swift / BIC">
              <Input value={d.bankSwift} onChange={(v) => set("bankSwift", v)} placeholder="e.g. TRWIBEB1XXX" />
            </Field>
          </Accordion>

          <Accordion title="Signature & Footer" icon="✍️" hint="Signatory & footer note" open={openSections.has("Signature")} onToggle={() => toggleSection("Signature")}>
            <Field label="Signatory name">
              <Input value={d.signatoryName} onChange={(v) => set("signatoryName", v)} placeholder="e.g. John Smith" />
            </Field>
            <Field label="Signatory title">
              <Input value={d.signatoryTitle} onChange={(v) => set("signatoryTitle", v)} placeholder="Authorized Signatory" />
            </Field>
            <Field label="">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={d.showSignatureLine}
                  onChange={(e) => set("showSignatureLine", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show signature line</span>
              </label>
            </Field>
            <Field label="Footer note">
              <Textarea value={d.footerNote} onChange={(v) => set("footerNote", v)} placeholder="This is an official payment receipt..." />
            </Field>
          </Accordion>
        </div>
      </div>

      {/* ── Right: Preview ── */}
      <div className="print-full flex-1 bg-gray-300 overflow-y-auto flex justify-center py-8 px-4">
        <div ref={previewRef} className="w-full max-w-[794px] shadow-2xl">
          <SlipPreview d={d} />
        </div>
      </div>
    </div>
  );
}
