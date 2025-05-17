import { SectionHeading } from "@/components/molecules";
import { Scan, BarChart3, Coins } from "lucide-react";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="How It Works: Scan. Deploy. Earn."
        subtitle="Our AI engine transforms underused infrastructure into real income with our automated intelligence loop."
        centered
      />

      <div className="grid md:grid-cols-3 gap-12 mt-16">
        {/* Step 1: Scan */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#5ED3F333] p-6 rounded-full mb-6">
            <Scan className="text-[#5ED3F3]" size={32} />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-[#F2F5F9]">
            1. Scan
          </h3>
          <p className="text-[#F2F5F9]">
            We scan your systems to detect idle compute, bandwidth, or storage.
          </p>
        </div>

        {/* Step 2: Score / Deploy */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#5ED3F333] p-6 rounded-full mb-6">
            <BarChart3 className="text-[#5ED3F3]" size={32} />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-[#F2F5F9]">
            2. Score (Deploy)
          </h3>
          <p className="text-[#F2F5F9]">
            Each resource is rated with a DUVI (DePIN Utility Value Index) based
            on compatibility and reward potential.
          </p>
        </div>

        {/* Step 3: Stake / Earn */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#00FFAA33] p-6 rounded-full mb-6">
            <Coins className="text-[#00FFAA]" size={32} />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-[#F2F5F9]">
            3. Stake (Earn)
          </h3>
          <p className="text-[#F2F5F9]">
            Resources are routed to the best DePINs—like Render or Grass—to earn
            yield, auto-compounded.
          </p>
        </div>
      </div>
    </section>
  );
}
