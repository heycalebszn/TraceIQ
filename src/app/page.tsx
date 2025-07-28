"use client";

import { useState } from "react";
import { MarketingNavbar } from "@/components/layouts/MarketingNavbar";
import { Hero } from "@/components/layouts/Hero";
import { HowItWorksSection } from "@/components/layouts/HowItWorksSection";
import { ResultSection } from "@/components/layouts/ResultSection";
import {
  TransactionInput,
  TransactionData,
} from "@/components/layouts/TransactionInput";
import { Footer } from "@/components/layouts/Footer";

export default function Home() {
  const [result, setResult] = useState<TransactionData | null>(null);

  return (
    <>
      <MarketingNavbar />
      <div className="flex flex-col space-y-10">
        <Hero />
        <HowItWorksSection />
        <TransactionInput onAnalyze={setResult} />
        <ResultSection visible={!!result} data={result || undefined} />
        <Footer />
      </div>
    </>
  );
}
