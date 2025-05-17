"use client";

import { useState } from "react";
import { DePinCard } from "@/components/molecules";

export default function AvailableDePINs() {
  const [dePINs] = useState([
    { id: 1, name: "Grass.io", status: "available" },
    { id: 2, name: "OpenLoop", status: "coming_soon" },
    { id: 3, name: "Render Network", status: "coming_soon" },
  ]);

  const handleSetup = (id: number) => {
    console.log(`Setting up DePIN with id: ${id}`);
    // Implementation for setup process
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 rounded-xl border border-gray-800/50 shadow-2xl backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 flex items-center font-display">
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Available DePINs
          </span>
        </h2>
        <div className="space-y-3">
          {dePINs.map((depin) => (
            <DePinCard
              key={depin.id}
              name={depin.name}
              status={depin.status}
              onClick={() => handleSetup(depin.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
