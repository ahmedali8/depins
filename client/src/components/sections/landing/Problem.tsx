import { SectionHeading } from "@/components/molecules";
import { Zap, Network, PiggyBank } from "lucide-react";

export default function Problem() {
  return (
    <section
      id="problem"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="The Problem: Valuable Infrastructure sits Idle, Potential Income is never earned"
        centered
        subtitle="Most institutions sit on mountains of surplus digital resources—compute, bandwidth, storage—that should be earning Dollars. But they have neither the inhouse expertise or mental bandwidth to leverage it. Current Web3 DePINs Solutions were never designed for Web2 Institutions click & deploy requirements."
      />

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="bg-[#5ED3F333] p-4 rounded-lg w-fit mb-6">
            <Zap className="text-[#5ED3F3]" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-4 text-[#F2F5F9]">
            Complex Staking Choices
          </h3>
          <p className="text-[#F2F5F9]">
            There are too many tokens, protocols, and lock-up rules—nobody knows
            where to start.
          </p>
        </div>

        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="bg-[#5ED3F333] p-4 rounded-lg w-fit mb-6">
            <Network className="text-[#5ED3F3]" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-4 text-[#F2F5F9]">
            Hard to Integrate with DePINs
          </h3>
          <p className="text-[#F2F5F9]">
            Every protocol is different. Most need manual setup and wallet
            connections.
          </p>
        </div>

        <div className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]">
          <div className="bg-[#00FFAA33] p-4 rounded-lg w-fit mb-6">
            <PiggyBank className="text-[#00FFAA]" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-4 text-[#F2F5F9]">
            Yield Is Left on the Table
          </h3>
          <p className="text-[#F2F5F9]">
            Institutions can't earn from what they already own—because staking
            infrastructure is disconnected.
          </p>
        </div>
      </div>
    </section>
  );
}
