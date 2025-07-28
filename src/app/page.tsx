import { MarketingNavbar } from "@/components/layouts/MarketingNavbar";
import { Hero } from "@/components/layouts/Hero";
import { HowItWorksSection } from "@/components/layouts/HowItWorksSection";
import { ResultSection } from "@/components/layouts/ResultSection";

export default function Home() {
  return (
    <div className="flex flex-col space-y-10">
      <MarketingNavbar />
      <Hero />
      <HowItWorksSection />
      <ResultSection
        visible={true}
        data={{
          from: "0x123...",
          to: "0x456...",
          value: "1.5 ETH",
          token: "ETH",
          summary:
            "This transaction is part of a larger pattern involving multiple wallets.",
        }}
      />
    </div>
  );
}
