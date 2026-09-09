import React, { useState } from 'react';
import {
  DollarSign,
  Calculator,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Landmark,
  Percent
} from 'lucide-react';
import { LoanProvider, Currency } from '../types';
import { useContent } from '../context/ContentContext';

interface LoanMarketplaceProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const LoanMarketplace: React.FC<LoanMarketplaceProps> = ({
  onOpenBookingWithDetails
}) => {
  const { loanProviders } = useContent();
  const [loanAmountINR, setLoanAmountINR] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(7);

  // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const calculateEMI = () => {
    const principal = Number(loanAmountINR) || 0;
    const rate = Number(interestRate) || 0;
    const years = Number(tenureYears) || 1;
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    if (months <= 0) return 0;
    if (monthlyRate === 0) return Math.round(principal / months);
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return isNaN(emi) || !isFinite(emi) ? 0 : Math.round(emi);
  };

  const monthlyEMI = calculateEMI() || 0;
  const safeTenureYears = Number(tenureYears) || 1;
  const totalPayable = monthlyEMI * safeTenureYears * 12;
  const totalInterest = Math.max(0, totalPayable - (Number(loanAmountINR) || 0));

  return (
    <section id="loans" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" /> 100% Pre-Approved Financing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education Loan Marketplace & EMI Calculator
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-base">
            Get instant pre-visa sanction letters from leading Indian banks and NBFCs with zero collateral options up to ₹40 Lakhs.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* EMI Calculator Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Interactive Loan EMI Calculator
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                Live Formula
              </span>
            </div>

            {/* Slider 1: Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Loan Amount required</span>
                <span className="text-amber-300 font-bold text-sm">
                  ₹{(loanAmountINR / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={7500000}
                step={100000}
                value={loanAmountINR}
                onChange={(e) => setLoanAmountINR(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Slider 2: Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Interest Rate (% p.a.)</span>
                <span className="text-orange-300 font-bold text-sm">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={8.0}
                max={13.5}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-orange-400"
              />
            </div>

            {/* Slider 3: Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Repayment Tenure</span>
                <span className="text-purple-300 font-bold text-sm">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* EMI Output Box */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-3 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Monthly EMI Estimate</p>
                <p className="text-3xl font-black text-emerald-400">₹{(monthlyEMI || 0).toLocaleString()} / mo</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Interest</span>
                  <span className="font-bold text-amber-300">₹{Math.round(totalInterest / 100000).toFixed(2)} L</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Repayment</span>
                  <span className="font-bold text-orange-300">₹{Math.round(totalPayable / 100000).toFixed(2)} L</span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                onOpenBookingWithDetails(
                  `Education Loan Sanction Request: Amount ₹${(loanAmountINR / 100000).toFixed(1)}L, Rate: ${interestRate}%`
                )
              }
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Get 48-Hour Loan Sanction Letter</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Bank Cards Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#EA580C]" /> Bank & NBFC Partners
            </h3>

            <div className="grid gap-4">
              {loanProviders.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-800 p-1 flex items-center justify-center border border-orange-200 dark:border-slate-700">
                        <Landmark className="w-5 h-5 text-[#EA580C]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{bank.bankName}</h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          Rate: {bank.interestRate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {bank.features.map((f, i) => (
                        <span key={i} className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBookingWithDetails(`Applying for Loan with ${bank.bankName}`)}
                    className="py-2.5 px-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
                  >
                    Book Consultation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
