"use client";

// ── Logo ──────────────────────────────────────────────────────────────────────

const OMNIGPT_LOGO = "data:image/png;base64,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";

// ── Invoice data ──────────────────────────────────────────────────────────────

interface InvoiceRecord {
  id: string;
  date: string;
  amount: number;
  bonus: number;
  description: string;
}

const INVOICES: InvoiceRecord[] = [
  { id: "INV-0001", date: "2025-05-06", amount: 520,  bonus: 0,   description: "Hourly Contract - Upwork" },
  { id: "INV-0002", date: "2025-06-02", amount: 700,  bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0003", date: "2025-07-04", amount: 700,  bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0004", date: "2025-08-12", amount: 700,  bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0005", date: "2025-09-08", amount: 1200, bonus: 450, description: "Monthly Salary" },
  { id: "INV-0006", date: "2025-10-08", amount: 1200, bonus: 450, description: "Monthly Salary" },
  { id: "INV-0007", date: "2025-11-05", amount: 1200, bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0008", date: "2025-12-04", amount: 1200, bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0009", date: "2026-01-05", amount: 1200, bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0010", date: "2026-02-04", amount: 1200, bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0011", date: "2026-03-04", amount: 1200, bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0012", date: "2026-04-03", amount: 1200, bonus: 0,   description: "Monthly Salary" },
  { id: "INV-0013", date: "2026-05-08", amount: 1200, bonus: 0,   description: "Monthly Salary" },
];

// ── Common fields ─────────────────────────────────────────────────────────────

const BRAND_COLOR = "#000224";
const BANNER_COLOR = "#f0fff9";
const CURRENCY    = "USD";

const PAYER = {
  name:    "Omnigpt Ltd",
  email:   "support@omnigpt.co",
  address: "Bangkok, Thailand",
};

const PAYEE = {
  name:    "Muhammad Anique",
  email:   "anique.cs@gmail.com",
  phone:   "+923204589040",
  address: "G.T Road, Kharian\nGujrat, Punjab 50090\nPakistan",
};

const BANK = {
  accountName:   "Muhammad Anique",
  bankName:      "Meezan Bank",
  iban:          "PK28MEZN0067010111081882",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY, minimumFractionDigits: 2 }).format(amount);
}

function ordinal(n: number): string {
  const v = n % 100;
  return n + (["th","st","nd","rd"][(v - 20) % 10] ?? ["th","st","nd","rd"][v] ?? "th");
}

function fmtDate(dateStr: string, showDay = true): string {
  if (!dateStr) return "";
  const dt = new Date(dateStr + "T00:00:00");
  if (isNaN(dt.getTime())) return dateStr;
  const month   = dt.toLocaleDateString("en-US", { month: "long" });
  const year    = dt.getFullYear();
  const day     = ordinal(dt.getDate());
  if (showDay) {
    const weekday = dt.toLocaleDateString("en-US", { weekday: "short" });
    return `${weekday}, ${month} ${day}, ${year}`;
  }
  return `${month} ${day}, ${year}`;
}

// ── Print CSS ─────────────────────────────────────────────────────────────────

const PRINT_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; background: #fff; font-family: Arial, Helvetica, sans-serif; }
  @page { size: A4; margin: 0; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  table { border-collapse: collapse; width: 100%; }
  img { display: block; }
  .page { width: 210mm; min-height: 297mm; display: flex; flex-direction: column; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
`;

// ── HTML builder ──────────────────────────────────────────────────────────────

function buildInvoiceHtml(inv: InvoiceRecord): string {
  const total   = inv.amount + inv.bonus;
  const dateStr = fmtDate(inv.date, true);
  const color   = BRAND_COLOR;

  const bonusRow = inv.bonus > 0 ? `
    <tr style="border-bottom:1px solid #f8f8f8">
      <td style="padding:10px 0 10px;color:#6b7280">Bonus</td>
      <td style="padding:10px 0 10px;text-align:right;color:#374151">${fmtMoney(inv.bonus)}</td>
    </tr>` : "";

  const bankSection = `
    <div style="padding:32px 48px;border-bottom:1px solid #fafafa">
      <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:16px">Payment Instructions</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="padding:2px 0;color:#9ca3af;width:144px">Account Name</td><td style="padding:2px 0;font-weight:600;color:#1f2937">${BANK.accountName}</td></tr>
        <tr><td style="padding:2px 0;color:#9ca3af">Bank</td><td style="padding:2px 0;color:#374151">${BANK.bankName}</td></tr>
        <tr><td style="padding:2px 0;color:#9ca3af">IBAN</td><td style="padding:2px 0;font-family:monospace;color:#374151">${BANK.iban}</td></tr>
      </table>
    </div>`;

  const addressLines = PAYEE.address.split("\n").join("<br/>");

  return `
  <div class="page">
    <!-- Header -->
    <div style="padding:40px 48px;background-color:${color}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between">
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px">
          <img src="${OMNIGPT_LOGO}" alt="OmniGPT" style="height:40px;object-fit:contain" />
          <p style="font-size:12px;color:rgba(255,255,255,0.7);max-width:280px;margin-top:4px">Seamlessly integrate AI into your life and work through OmniGPT.</p>
        </div>
        <div style="text-align:right">
          <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.6)">Invoice</p>
          <p style="color:#fff;font-size:22px;font-weight:700;margin-top:4px">${inv.id}</p>
          <p style="font-size:13px;margin-top:2px;color:rgba(255,255,255,0.75)">${dateStr}</p>
        </div>
      </div>
    </div>

    <!-- Amount banner -->
    <div style="padding:32px 48px;background-color:${BANNER_COLOR};border-bottom:1px solid #fafafa">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:4px">Amount Due</p>
          <p style="font-size:48px;font-weight:700;color:#111827;line-height:1">${fmtMoney(total)}</p>
          <p style="font-size:13px;color:#9ca3af;margin-top:8px">Pay via Wise Transfer</p>
        </div>
        <div style="font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:8px 24px;border:4px solid ${color};color:${color};border-radius:4px">PAID</div>
      </div>
    </div>

    <!-- Payer / Payee -->
    <div style="padding:32px 48px;border-bottom:1px solid #fafafa">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px">
        <div>
          <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #fafafa">Bill To</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="padding:2px 0;color:#9ca3af;width:80px">Name</td><td style="padding:2px 0;font-weight:600;color:#1f2937">${PAYER.name}</td></tr>
            <tr><td style="padding:2px 0;color:#9ca3af">Email</td><td style="padding:2px 0;color:#4b5563">${PAYER.email}</td></tr>
            <tr><td style="padding:2px 0;color:#9ca3af;vertical-align:top">Address</td><td style="padding:2px 0;color:#6b7280">${PAYER.address}</td></tr>
          </table>
        </div>
        <div>
          <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #fafafa">From</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="padding:2px 0;color:#9ca3af;width:80px">Name</td><td style="padding:2px 0;font-weight:600;color:#1f2937">${PAYEE.name}</td></tr>
            <tr><td style="padding:2px 0;color:#9ca3af">Email</td><td style="padding:2px 0;color:#4b5563">${PAYEE.email}</td></tr>
            <tr><td style="padding:2px 0;color:#9ca3af">Phone</td><td style="padding:2px 0;color:#4b5563">${PAYEE.phone}</td></tr>
            <tr><td style="padding:2px 0;color:#9ca3af;vertical-align:top">Address</td><td style="padding:2px 0;color:#6b7280">${addressLines}</td></tr>
          </table>
        </div>
      </div>
    </div>

    <!-- Breakdown -->
    <div style="padding:32px 48px;border-bottom:1px solid #fafafa">
      <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:16px">Payment Breakdown</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:1px solid #f2f2f2">
            <th style="text-align:left;padding:8px 0;font-weight:600;color:#6b7280">Description</th>
            <th style="text-align:right;padding:8px 0;font-weight:600;color:#6b7280">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f8f8f8">
            <td style="padding:10px 0;color:#374151">${inv.description}</td>
            <td style="padding:10px 0;text-align:right;color:#1f2937;font-weight:500">${fmtMoney(inv.amount)}</td>
          </tr>
          <tr style="border-bottom:1px solid #f8f8f8">
            <td style="padding:10px 0;color:#6b7280">Subtotal</td>
            <td style="padding:10px 0;text-align:right;color:#374151">${fmtMoney(inv.amount)}</td>
          </tr>
          ${bonusRow}
        </tbody>
        <tfoot>
          <tr style="border-top:1px solid #eeeeee">
            <td style="padding:12px 0 4px;font-weight:700;color:#111827">Total</td>
            <td style="padding:12px 0 4px;text-align:right;font-weight:700;color:#111827;font-size:15px">${fmtMoney(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    ${bankSection}

    <!-- Signature -->
    <div style="padding:64px 48px 16px">
      <div style="display:flex;justify-content:flex-end">
        <div style="text-align:center;min-width:200px">
          <div style="border-bottom:2px solid #d1d5db;height:48px;margin-bottom:8px"></div>
          <p style="font-size:13px;font-weight:600;color:#1f2937">Muhammad Anique</p>
          <p style="font-size:11px;color:#9ca3af;margin-top:2px">Authorized Signatory</p>
        </div>
      </div>
    </div>

    <!-- Spacer -->
    <div style="flex:1"></div>

    <!-- Footer -->
    <div style="padding:20px 48px;border-top:1px solid #fafafa;background:#f9fafb">
      <p style="font-size:11px;color:#9ca3af;text-align:center">This is an official invoice. Please retain for your records.</p>
    </div>
  </div>`;
}

// ── Print helpers ─────────────────────────────────────────────────────────────

function openPrintWindow(title: string, htmlBody: string): void {
  const win = window.open("", "_blank", "width=900,height=1200");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head>
    <title>${title}</title>
    <style>${PRINT_CSS}</style>
  </head><body>${htmlBody}<script>
    window.onload = function() { setTimeout(function(){ window.print(); window.close(); }, 250); };
    setTimeout(function(){ window.print(); window.close(); }, 1200);
  <\/script></body></html>`);
  win.document.close();
}

function handlePrintAll(): void {
  const html = INVOICES.map((inv) => buildInvoiceHtml(inv)).join("\n");
  openPrintWindow("OmniGPT Invoices – All 13", html);
}

function handlePrintOne(inv: InvoiceRecord): void {
  openPrintWindow(`Invoice ${inv.id}`, buildInvoiceHtml(inv));
}

// ── Screen preview card ───────────────────────────────────────────────────────

function InvoiceCard({ inv }: { inv: InvoiceRecord }) {
  const total = inv.amount + inv.bonus;
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-[794px]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full" style={{ backgroundColor: BRAND_COLOR }} />
          <div>
            <p className="text-sm font-bold text-gray-900">{inv.id}</p>
            <p className="text-xs text-gray-400">{fmtDate(inv.date, true)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-base font-bold text-gray-900">{fmtMoney(total)}</p>
          <button
            onClick={() => handlePrintOne(inv)}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            Print PDF
          </button>
        </div>
      </div>
      <div className="px-6 py-3 text-xs text-gray-500">
        <span className="mr-4"><span className="text-gray-400">Description:</span> {inv.description}</span>
        {inv.bonus > 0 && <span><span className="text-gray-400">Bonus:</span> {fmtMoney(inv.bonus)}</span>}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900">OmniGPT Invoices</h1>
          <p className="text-xs text-gray-400 mt-0.5">13 invoices · Muhammad Anique → Omnigpt Ltd</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-800 transition">← Generator</a>
          <button
            onClick={handlePrintAll}
            className="rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            Print All 13 PDFs
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 py-8 px-4">
        {INVOICES.map((inv) => (
          <InvoiceCard key={inv.id} inv={inv} />
        ))}
      </div>
    </div>
  );
}
