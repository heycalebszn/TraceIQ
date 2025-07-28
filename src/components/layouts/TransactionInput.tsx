"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export interface TransactionData {
  from: string;
  to: string;
  value: string;
  token: string;
  summary: string;
}

export const TransactionInput = ({
  onAnalyze,
}: {
  onAnalyze: (data: TransactionData) => void;
}) => {
  const [txHash, setTxHash] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTxHash(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // simulated api response
    const mocked = {
      from: "0xAlice",
      to: "0xBob",
      value: "5.2 ETH",
      token: "ETH",
      summary:
        "Funds passed through Tornado Cash before landing on 0xBob. Risk Score: 87/100.",
    };

    onAnalyze(mocked);
  };

  return (
    <div className="w-full px-4" id="demo">
      <PlaceholdersAndVanishInput
        placeholders={[
          "Enter transaction hash...",
          "0x123abc...",
          "Try a Base hash",
        ]}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {/* test addr: 0x5e8d6a8baf2f7f98f4f6f22db24e0a65053a9d3022cb4a5ad0c9b83a429c9fce */}
    </div>
  );
};
