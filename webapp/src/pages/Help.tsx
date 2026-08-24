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
  CheckCircle2,
  XCircle,
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
          Complete guide to Stripe payment infrastructure, fleet integration, safety guardrails, entity types, and Austrian onboarding compliance.
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

        {/* 3. Do You Need a GmbH? & Supported Entity Types */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle('gmbh-requirements')}
            className="w-full p-5 text-left font-semibold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">3. Do You Need a GmbH? Supported Entity Types in Austria</h2>
                <p className="text-xs text-slate-400 font-normal">Freelancers (Einzelunternehmen) vs GmbH vs FlexCo vs Verein</p>
              </div>
            </div>
            {openSection === 'gmbh-requirements' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'gmbh-requirements' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-4 leading-relaxed">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-3 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">NO — You do NOT need a GmbH to use Stripe!</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Stripe supports individual freelancers, sole proprietors (*Einzelunternehmen*), partnerships, non-profits, and incorporated companies in Austria.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 text-sm">1. Einzelunternehmen (Individual / Sole Proprietor)</div>
                  <p className="text-slate-400">Freelancers (*Freiberufler*), solo developers, or unregistered sole traders. <strong>Most common for starting out.</strong> Requires only 1 person for identity & address verification.</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 text-sm">2. Eingetragenes Einzelunternehmen (e.U.)</div>
                  <p className="text-slate-400">Sole trader registered in the Austrian Commercial Register (*Firmenbuch*). Requires *Firmenbuch* registration number.</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 text-sm">3. GmbH / FlexCo / AG</div>
                  <p className="text-slate-400">Incorporated limited liability companies. Requires Commercial Register excerpt (*Firmenbuchauszug*) and verification of all UBOs holding &gt;25% shares.</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 text-sm">4. OG / KG / Verein</div>
                  <p className="text-slate-400">Business partnerships (*Personengesellschaften*) or registered non-profit associations (*Verein* with ZVR number).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Onboarding & Registration Requirements (Brother Steve's Meldezettel & 2 Persons Rule) */}
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
                <h2 className="text-base font-bold text-white">4. Stripe Austria Onboarding & Verification (Meldezettel & 2-Person Rules)</h2>
                <p className="text-xs text-slate-400 font-normal">Know Your Customer (KYC), Single vs Multi-Person Verification & Address Rules</p>
              </div>
            </div>
            {openSection === 'onboarding-requirements' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'onboarding-requirements' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-4 leading-relaxed">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200">
                <div className="font-bold text-rose-400 text-sm mb-1">Fact-Check: Brother Steve's Onboarding & Meldezettel Report</div>
                <p>
                  Brother Steve reported that Stripe registration requires <strong>two persons</strong> and a <strong>Meldezettel not older than 3 months</strong>. Here is how onboarding rules differ by entity type:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white text-sm mb-1 text-emerald-400">Single Person Onboarding (Einzelunternehmen)</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong>1 Person Needed</strong>: Only yourself.</li>
                    <li><strong>Documents</strong>: Passport/ID + Home Address Proof (Meldezettel or Bank statement dated &lt; 3-6 months).</li>
                    <li><strong>Tax ID</strong>: Personal Austrian *Steuernummer*.</li>
                    <li><strong>Bank Account</strong>: Personal Austrian IBAN.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-bold text-white text-sm mb-1 text-amber-400">Multi-Person Onboarding (GmbH / Partnerships)</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong>2+ Persons Needed</strong>: Stripe must verify the Account Representative AND all **Ultimate Beneficial Owners (UBOs)** with &gt;25% equity or co-directors.</li>
                    <li><strong>Documents</strong>: Full ID + recent Meldezettel for each UBO/Director.</li>
                    <li><strong>Entity Docs</strong>: Recent *Firmenbuchauszug* + UID / ATU number.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-white text-sm mb-1">Proof of Address (Meldezettel / Meldebestätigung Rules)</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Recency Limit</strong>: Official address proof (*Meldezettel*, *Meldebestätigung*, bank statement, or utility bill) must be fresh (**strictly dated within the last 3 to 6 months**).</li>
                  <li><strong>Two-Document Rule</strong>: You **cannot** use the same document for photo ID and proof of address. If a Passport or Driver's License is uploaded as photo ID, a separate document (recent Meldezettel or bank statement) must be uploaded for home address proof.</li>
                  <li><strong>Color & Corners</strong>: Scans must be in full color, showing all four corners clearly.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 5. Safety Considerations & Security Guardrails */}
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
                <h2 className="text-base font-bold text-white">5. Safety Considerations & Guardrails</h2>
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
              </div>
            </div>
          )}
        </div>

        {/* 6. Fleet Integration Architecture */}
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
                <h2 className="text-base font-bold text-white">6. Fleet Integration Architecture</h2>
                <p className="text-xs text-slate-400 font-normal">Central Payment Hub for all 213 Fleet Repositories</p>
              </div>
            </div>
            {openSection === 'fleet-integration' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'fleet-integration' && (
            <div className="p-5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                In our 213-repo workspace, `stripe-mcp` serves as the <strong>single point of truth for monetizing fleet webapps and services</strong> (such as `myai`, `deepfang`, `openclaw-molt-mcp`, `speechnotes`, etc.).
              </p>
            </div>
          )}
        </div>

        {/* 7. Paying vs Receiving Payments */}
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
                <h2 className="text-base font-bold text-white">7. Paying vs Receiving Payments (Inbound vs Outbound)</h2>
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
