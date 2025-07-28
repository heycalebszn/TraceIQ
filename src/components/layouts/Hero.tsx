"use client";

import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { NavbarButton } from "@/components/ui/resizable-navbar";

export const Hero = () => {
  return (
    <HeroHighlight>
      <div className="text-center mt-10 max-w-7xl mx-auto space-y-8" id="home">
        <h1 className="text-4xl sm:text-6xl font-bold text-black dark:text-white">
          <Highlight>Trace blockchain transactions</Highlight> across chains
          with AI.
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Input a hash. Let our agents reveal the story behind the transaction
          with JuliaOS agents.
        </p>
        <div className="flex justify-center">
          <NavbarButton href="#demo" variant="dark">
            Try Now
          </NavbarButton>
        </div>
      </div>
    </HeroHighlight>
  );
};
