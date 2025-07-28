"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: "🧠",
    title: "Agent Activated",
    description:
      "AI agent reads the transaction hash and queries onchain data.",
  },
  {
    icon: "🔍",
    title: "Path Traced",
    description:
      "It follows the transaction trail across bridges, mixers, and wallets.",
  },
  {
    icon: "📊",
    title: "Risk Scored",
    description:
      "Returns a detailed report highlighting suspicious activity and patterns.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how" className="w-full py-20 px-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold dark:text-white">
          How It Works
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Our onchain AI agent breaks down the transaction into key steps:
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className={cn(
                "rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 shadow-md p-6 text-left backdrop-blur-md"
              )}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
