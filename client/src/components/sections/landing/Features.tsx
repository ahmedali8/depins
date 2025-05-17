import { SectionHeading } from "@/components/molecules";
import { Brain, Database, Plug, BarChart3, Key, Shield } from "lucide-react";

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="Built to Make Infra Work Smarter"
        subtitle="Everything is designed to abstract complexity and deliver yield from day one."
        centered
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {/* AI Optimizer */}
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="flex items-center mb-4">
            <div className="bg-[#5ED3F333] p-3 rounded-lg mr-4">
              <Brain className="text-[#5ED3F3]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-[#F2F5F9]">
              AI Optimizer
            </h3>
          </div>
          <p className="text-[#F2F5F9]">
            Uses real-time data and reinforcement learning to maximize rewards.
          </p>
        </div>

        {/* Meta-Vault */}
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="flex items-center mb-4">
            <div className="bg-[#5ED3F333] p-3 rounded-lg mr-4">
              <Database className="text-[#5ED3F3]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-[#F2F5F9]">Meta-Vault</h3>
          </div>
          <p className="text-[#F2F5F9]">
            Accepts SOL, LSTs, and DePIN tokens—auto-mints receipt tokens for
            yield tracking.
          </p>
        </div>

        {/* Adapter Layer */}
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="flex items-center mb-4">
            <div className="bg-[#00FFAA33] p-3 rounded-lg mr-4">
              <Plug className="text-[#00FFAA]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-[#F2F5F9]">
              Adapter Layer
            </h3>
          </div>
          <p className="text-[#F2F5F9]">
            Connects to protocols like Marinade, Grass, Render, and more.
          </p>
        </div>

        {/* DUVI Scoring */}
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="flex items-center mb-4">
            <div className="bg-[#FFD16633] p-3 rounded-lg mr-4">
              <BarChart3 className="text-[#FFD166]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-[#F2F5F9]">
              DUVI Scoring
            </h3>
          </div>
          <p className="text-[#F2F5F9]">
            Evaluates and ranks your assets' suitability across staking
            protocols.
          </p>
        </div>

        {/* Non-Custodial by Default */}
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="flex items-center mb-4">
            <div className="bg-[#FF4D6D33] p-3 rounded-lg mr-4">
              <Key className="text-[#FF4D6D]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-[#F2F5F9]">
              Non-Custodial by Default
            </h3>
          </div>
          <p className="text-[#F2F5F9]">
            Your keys, your infra—we just optimize on top.
          </p>
        </div>

        {/* Risk Controls */}
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="flex items-center mb-4">
            <div className="bg-[#5ED3F333] p-3 rounded-lg mr-4">
              <Shield className="text-[#5ED3F3]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-[#F2F5F9]">
              Risk Controls
            </h3>
          </div>
          <p className="text-[#F2F5F9]">
            Built-in whitelists, policy wallets, and smart alerts.
          </p>
        </div>
      </div>
    </section>
  );
}
