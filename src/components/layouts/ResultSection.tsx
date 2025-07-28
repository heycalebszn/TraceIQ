"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TransactionGraph } from "@/components/layouts/TransactionGraph";
import { Node, Edge } from "@xyflow/react";

interface ResultSectionProps {
  visible: boolean;
  data?: {
    from: string;
    to: string;
    value: string;
    token: string;
    summary: string;
  };
}

export const ResultSection = ({ visible, data }: ResultSectionProps) => {
  const [loading, setLoading] = useState(true);

  // Example graph data
  const exampleNodes: Node[] = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "Sender" } },
    { id: "2", position: { x: 250, y: 0 }, data: { label: "Bridge" } },
    { id: "3", position: { x: 500, y: 0 }, data: { label: "Receiver" } },
  ];

  const exampleEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3", animated: true },
  ];

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible || !data) return null;

  return (
    <section className="w-full mt-15 px-6 py-16 bg-black">
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-center">Analysis Results</h2>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-md p-6 backdrop-blur-md"
        >
          <h3 className="text-xl font-semibold mb-2 dark:text-white">
            Transaction Details
          </h3>
          <p className="text-sm text-black dark:text-neutral-400">
            <strong>From:</strong> {data.from} <br />
            <strong>To:</strong> {data.to} <br />
            <strong>Value:</strong> {data.value} <br />
            <strong>Token:</strong> {data.token}
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-xl bg-purple-50/50 dark:bg-neutral-900/60 border border-purple-200 dark:border-neutral-800 shadow-md p-6 backdrop-blur-md"
        >
          <h3 className="text-xl font-semibold mb-2 dark:text-white">
            Agent Summary
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {data.summary}
          </p>
        </motion.div>

        {/* Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-xl border border-dashed text-black border-neutral-300 dark:border-neutral-700 p-6"
        >
          <h3 className="text-xl font-semibold mb-4 dark:text-white text-center">
            Transaction Path
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-purple-400 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <TransactionGraph nodes={exampleNodes} edges={exampleEdges} />
          )}
        </motion.div>

        {/* Download */}
        <div className="text-center">
          <button
            className="mt-4 rounded-lg bg-white px-6 py-2 text-black font-medium shadow-md hover:bg-neutral-800 transition"
            onClick={() => alert("Download started (mock).")}
          >
            Download Report
          </button>
        </div>
      </div>
    </section>
  );
};
