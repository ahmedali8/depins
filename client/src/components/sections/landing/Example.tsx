import { SectionHeading } from "@/components/molecules";
import { Plug2, CoinsIcon, Vault, Coins } from "lucide-react";

export default function Example() {
  return (
    <section
      id="example"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="What It Looks Like in Action"
        subtitle="dPINs makes yield staking seamless. Here's how it actually works using a real protocol—Grass."
        centered
      />

      <div className="max-w-4xl mx-auto mt-16 space-y-16">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-[#5ED3F333] p-4 rounded-full shrink-0">
            <Plug2 className="text-[#5ED3F3]" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-[#F2F5F9]">
              Step 1: Connect a Grass Node
            </h3>
            <p className="text-[#F2F5F9]">
              The user installs the Grass app and connects their network.
              dPINs.ai detects available bandwidth automatically.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-[#5ED3F333] p-4 rounded-full shrink-0">
            <CoinsIcon className="text-[#5ED3F3]" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-[#F2F5F9]">
              Step 2: Rewards Start Accumulating
            </h3>
            <p className="text-[#F2F5F9]">
              Grass awards points based on shared bandwidth. These are tracked
              on a personal dashboard and accumulate over each 7-day epoch.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-[#00FFAA33] p-4 rounded-full shrink-0">
            <Vault className="text-[#00FFAA]" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-[#F2F5F9]">
              Step 3: AI Collects and Routes Rewards
            </h3>
            <p className="text-[#F2F5F9]">
              At the end of the epoch, dPINs collects the user's earned points,
              converts them to GRASS tokens, and routes them into an optimized
              staking vault.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-[#FFD16633] p-4 rounded-full shrink-0">
            <Coins className="text-[#FFD166]" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-[#F2F5F9]">
              Step 4: stGRASS Token is Minted
            </h3>
            <p className="text-[#F2F5F9]">
              The user receives stGRASS—a yield-bearing receipt token. It can be
              used in DeFi or left to auto-compound through the dPINs optimizer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
