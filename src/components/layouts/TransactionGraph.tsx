"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface TransactionGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export const TransactionGraph = ({
  nodes: initialNodes,
  edges: initialEdges,
}: TransactionGraphProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((prev) => applyNodeChanges(changes, prev)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((prev) => applyEdgeChanges(changes, prev)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((prev) => addEdge(params, prev)),
    []
  );

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};
