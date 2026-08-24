import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  ShieldCheck,
  CreditCard,
  Layers,
  ShieldAlert,
  UserCheck,
  ArrowRightLeft,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Building2,
  Lock,
} from 'lucide-react';

export const Help: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('what-is-stripe');

  const toggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">stripe-mcp Operational Manual & Help System</h1>
        <p className="text-sm text-slate-400 mt-1">
          Complete guide to Stripe payment infrastructure, fleet integration, safety guardrails, and Austrian onboarding compliance.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. What is Stripe? */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('what-is-stripe')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">1. What is Stripe?</h2>
                <p className="text-xs text-slate-400 font-normal">Global Payment Gateway Infrastructure & Financial API</p>
              </div>
            </div>
            {openSection === 'what-is-stripe' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'what-is-stripe' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Stripe</strong> is a global payment processing gateway and financial infrastructure platform. It allows businesses, websites, and autonomous software agents to accept payments online, manage recurring SaaS subscriptions, issue invoices, handle chargeback disputes, and transfer payouts to bank accounts.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white mb-1">Inbound Payment Methods</div>
                  <p className="text-slate-400">Accept Credit Cards (Visa, Mastercard, Amex), Austrian EPS Online Banking, SEPA Direct Debit, Apple Pay, and Klarna.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white mb-1">SaaS Subscription Engine</div>
                  <p className="text-slate-400">Automated recurring billing, monthly plan management, tier upgrades, proration, and dunning workflows.</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white mb-1">Bank Payouts & Transfers</div>
                  <p className="text-slate-400">Automated daily/weekly settlements to merchant IBAN accounts (e.g. Austrian Erste Bank, Raiffeisen, BAWAG).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. What is stripe-mcp? */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('what-is-mcp')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">2. What is stripe-mcp?</h2>
                <p className="text-xs text-slate-400 font-normal">FastMCP 3.4+ Bridge Server & SOTA React Webapp Dashboard</p>
              </div>
            </div>
            {openSection === 'what-is-mcp' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'what-is-mcp' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>`stripe-mcp`</strong> is an enterprise FastMCP 3.4+ server paired with a SOTA React webapp running on port <code className="text-indigo-400 bg-slate-950 px-1 py-0.5 rounded">11166</code>. It acts as an agentic controller connecting AI assistants (Claude Desktop, Antigravity IDE, OpenManus) directly to Stripe API operations.
              </p>
              <p>
                Instead of requiring human operators to manually click through the Stripe dashboard, AI agents can execute high-level portmanteau tool calls:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                <li><strong className="text-indigo-400">manage_stripe_customers</strong>: Create profiles, search by email, verify ATU numbers.</li>
                <li><strong className="text-indigo-400">manage_stripe_subscriptions</strong>: List active subscribers, pause, resume, cancel.</li>
                <li><strong className="text-indigo-400">manage_stripe_payments</strong>: Inspect charges, 3DS2 status, issue policy-bounded refunds.</li>
                <li><strong className="text-indigo-400">manage_stripe_checkout</strong>: Generate Stripe Payment Links and BAO fiscal PDF invoices.</li>
                <li><strong className="text-indigo-400">calculate_austrian_vat</strong>: Calculate 20%/10%/13% rates & verify B2B Reverse Charge.</li>
              </ul>
            </div>
          )}
        </div>

        {/* 3. How will stripe-mcp be used by other fleet apps in the future? */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('fleet-integration')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">3. Fleet Integration Architecture</h2>
                <p className="text-xs text-slate-400 font-normal">Central Payment Hub for all 213 Fleet Repositories</p>
              </div>
            </div>
            {openSection === 'fleet-integration' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'fleet-integration' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                In our 213-repo workspace, `stripe-mcp` serves as the <strong>single point of truth for monetizing fleet webapps and services</strong> (such as `myai`, `deepfang`, `openclaw-molt-mcp`, `speechnotes`, etc.):
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2">
                  <span className="font-bold text-emerald-400 shrink-0">1. Unified Billing API:</span>
                  <span>Any fleet webapp can call <code className="text-white">http://127.0.0.1:11165/mcp</code> to initiate checkout sessions or verify customer active subscription status without embedding raw Stripe secret keys.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2">
                  <span className="font-bold text-emerald-400 shrink-0">2. Token Usage & Metered Credit Billing:</span>
                  <span>Autonomous subagents can record API consumption and trigger automatic balance top-ups through `stripe-mcp` payment links.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2">
                  <span className="font-bold text-emerald-400 shrink-0">3. Centralized Austrian Accounting:</span>
                  <span>All customer invoices across all fleet products are routed through `stripe-mcp`'s Austrian tax engine for unified BMD/RZL monthly export files.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Safety Considerations & Security Guardrails */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('safety-considerations')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">4. Safety Considerations & Guardrails</h2>
                <p className="text-xs text-slate-400 font-normal">Policy-Bounded Refunds, Read-Only Locks, and Audit Trails</p>
              </div>
            </div>
            {openSection === 'safety-considerations' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'safety-considerations' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-lg border border-amber-500/30">
                  <div className="font-bold text-amber-400 flex items-center space-x-1.5 mb-1">
                    <Lock className="w-4 h-4" />
                    <span>Refund Safety Cap Guardrail</span>
                  </div>
                  <p className="text-slate-400">
                    By default, <code className="text-amber-300">MAX_REFUND_AMOUNT_EUR = €500.00</code> blocks autonomous AI agents from issuing refunds exceeding €500 without manual human confirmation.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-lg border border-indigo-500/30">
                  <div className="font-bold text-indigo-400 flex items-center space-x-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Read-Only Evaluation Mode</span>
                  </div>
                  <p className="text-slate-400">
                    Setting <code className="text-indigo-300">STRIPE_READ_ONLY=true</code> permits inspection of charges and customer records while blocking all mutating actions (canceling, refunding, charging).
                  </p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white mb-1">Restricted API Keys (Least Privilege)</div>
                  <p className="text-slate-400">Never supply root secret keys (<code className="text-slate-300">sk_live_...</code>). Generate a Restricted API Key (<code className="text-slate-300">rk_live_...</code>) with write access strictly limited to required resources.</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white mb-1">Immutable Audit Logging</div>
                  <p className="text-slate-400">Every single agent tool execution is timestamped and recorded in the audit event stream accessible on port 11166 <code className="text-slate-300">/logs</code>.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Onboarding & Registration Requirements (Brother Steve's Meldezettel & 2 Persons Rule) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('onboarding-requirements')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-600/20 text-rose-400 rounded-lg">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">5. Stripe Austria Onboarding & Verification (Meldezettel Rules)</h2>
                <p className="text-xs text-slate-400 font-normal">Know Your Customer (KYC), Representative Verification & Document Requirements</p>
              </div>
            </div>
            {openSection === 'onboarding-requirements' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'onboarding-requirements' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-4 leading-relaxed">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200">
                <div className="font-bold text-rose-400 text-sm mb-1">Fact-Check: Brother Steve's Onboarding & Meldezettel Report</div>
                <p>
                  Brother Steve reported that Stripe registration requires <strong>two persons</strong> and a <strong>Meldezettel not older than 3 months</strong>. Here is the exact breakdown according to official EU AML (Anti-Money Laundering) & Stripe Austria compliance policies:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white text-sm mb-1">Rule A: Why Two Persons Are Required (Representative & UBO Verification)</div>
                  <p className="text-slate-300">
                    Under EU 5th AML Directive regulations, Stripe requires identifying and verifying:
                  </p>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-400">
                    <li><strong>1. The Account Representative</strong>: The legal individual opening and operating the Stripe account on behalf of the company.</li>
                    <li><strong>2. Ultimate Beneficial Owners (UBOs) & Co-Directors</strong>: Every natural person who directly or indirectly holds <strong>more than 25%</strong> of company shares/voting rights, or managing directors listed in the Austrian Commercial Register (<em>Firmenbuchauszug</em>).</li>
                  </ul>
                  <p className="mt-2 text-slate-300">
                    Therefore, for standard Austrian companies (GmbH, OG, KG) with two co-founders or managing directors, <strong>both persons must submit identity and address verification documents</strong> before Stripe will issue live API keys or enable payouts.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white text-sm mb-1">Rule B: Proof of Address (Meldezettel / Meldebestätigung Rules)</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong>Recency Requirement</strong>: Bank statements, utility bills, or official Austrian <em>Meldezettel / Meldebestätigung</em> documents must be fresh (Stripe guidelines accept up to 6 months, but European AML bank checks strictly enforce <strong>under 3 months</strong> for proof of address).</li>
                    <li><strong>Two-Document Rule</strong>: You <strong>cannot</strong> use the same document for photo ID and proof of address. If a Passport or Driver's License is uploaded as photo ID, a separate document (recent Meldezettel or bank statement) must be uploaded for address proof.</li>
                    <li><strong>Color & Corners</strong>: Scans must be in full color, showing all four corners clearly.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Paying vs Receiving Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('paying-vs-receiving')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">6. Paying vs Receiving Payments (Inbound vs Outbound)</h2>
                <p className="text-xs text-slate-400 font-normal">Customer Charges vs Refunds, Payouts, and Transfer Flows</p>
              </div>
            </div>
            {openSection === 'paying-vs-receiving' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'paying-vs-receiving' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-emerald-400 text-sm mb-2 flex items-center space-x-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Receiving Money (Inbound Revenue)</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li><strong>Stripe Checkout Sessions</strong>: Customer enters card or uses EPS online banking to pay an invoice.</li>
                    <li><strong>Recurring Subscriptions</strong>: Stripe automatically debits the customer card or SEPA account monthly.</li>
                    <li><strong>Payment Links</strong>: Shared URL for one-time purchases or custom contract settlements.</li>
                    <li><strong>Tax Settlement</strong>: Austrian VAT (20%/10%/13%) is calculated on top of net amount or zero-rated under Reverse Charge.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-amber-400 text-sm mb-2 flex items-center space-x-1.5">
                    <RotateCcwIcon className="w-4 h-4" />
                    <span>Paying Money (Outbound & Payouts)</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li><strong>Customer Refunds</strong>: Money returned to customer card or bank account, subject to `MAX_REFUND_AMOUNT_EUR` limit.</li>
                    <li><strong>Bank Account Payouts</strong>: Stripe transfers accumulated balance from Stripe holding account to your company IBAN in Austria.</li>
                    <li><strong>Connect Vendor Transfers</strong>: Sending payouts or split revenue shares to external third-party seller accounts.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
