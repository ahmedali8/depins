import { useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";

const chartData = Array.from({ length: 20 }, (_, i) => ({
  name: `T${i + 1}`,
  value: 500 + Math.sin(i / 2) * 200 + Math.random() * 50,
}));

export default function EarningsDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
      <div className="bg-[#0e1729] text-white rounded-2xl p-8 max-w-xl w-full mx-auto border border-blue-600 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-white">
          dPINS.ai Earnings Dashboard
        </h2>

        <div>
          <p className="text-base text-gray-400 mb-2">Rewards Accumulated</p>

          <div className="flex items-center justify-between mb-4">
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="graphGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "none" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="url(#graphGradient)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#111827] rounded-lg p-6 px-12 border border-blue-500 ml-8">
              <p className="text-sm text-gray-400">Total Rewards</p>
              <p className="text-3xl font-bold">1,250.30</p>
              <p className="text-sm text-green-400 mt-2">▲ 36.15 (1h)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-[#111827] rounded-lg p-6 border border-blue-500">
            <p className="text-sm text-gray-400">Rewards</p>
            <p className="text-2xl font-semibold">750 GRASS</p>
          </div>

          <div className="bg-[#111827] rounded-lg p-6 border border-blue-500">
            <p className="text-sm text-gray-400">Converted</p>
            <p className="text-2xl font-semibold">0.5 mSOL</p>
          </div>

          <div className="bg-[#111827] rounded-lg p-6 border border-blue-500">
            <p className="text-sm text-gray-400 mb-1">DEPIN</p>
            <p className="text-base font-medium">Grass</p>
          </div>

          <div className="bg-[#111827] rounded-lg p-6 border border-blue-500">
            <p className="text-sm text-gray-400 mb-1">Staking</p>
            <p className="text-base font-medium">Marinade</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-6 italic">
          "Watch as your assets generate real-time rewards, automatically
          converted and reinvested to compound your earnings."
        </p>
      </div>
    </div>
  );
}
