import { SectionHeading } from "@/components/molecules";
import { Scan, Brain, Plug, Database, LayoutDashboard } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    title: "Local Scanner",
    description:
      "Maps available bandwidth, compute, and storage on user or institutional systems.",
    icon: Scan,
    iconColor: "#5ED3F3",
    bgColor: "#5ED3F333",
  },
  {
    title: "AI Optimizer",
    description:
      "Learns from real-time protocol performance to drive optimal staking across your infrastructure.",
    icon: Brain,
    iconColor: "#5ED3F3",
    bgColor: "#5ED3F333",
  },
  {
    title: "Adapter Layer",
    description:
      "Connects to Render, Grass, Marinade, and other yield protocols.",
    icon: Plug,
    iconColor: "#00FFAA",
    bgColor: "#00FFAA33",
  },
  {
    title: "Meta-Vault Program (on Solana)",
    description:
      "Mints receipt tokens (e.g. stGRASS, mRENDER) and executes staking logic.",
    icon: Database,
    iconColor: "#FFD166",
    bgColor: "#FFD16633",
  },
  {
    title: "Dashboard + Monitoring",
    description:
      "Users track yield, performance, and wallet balances in real time.",
    icon: LayoutDashboard,
    iconColor: "#5ED3F3",
    bgColor: "#5ED3F333",
  },
];

export default function Architecture() {
  return (
    <section
      id="architecture"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="Under the Hood: Modular, Secure, AI-Driven"
        subtitle="Our architecture is designed for scale, automation, and non-custodial security."
        centered
      />

      <div className="max-w-4xl mx-auto mt-16 space-y-8">
        {features.map((feature, index) => (
          <div key={index} className="relative">
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 bg-[#0E1729] p-6 rounded-xl border border-[#A3B1C6]">
              <div
                className="p-4 rounded-full shrink-0"
                style={{ backgroundColor: feature.bgColor }}
              >
                <feature.icon size={24} style={{ color: feature.iconColor }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#F2F5F9]">
                  {feature.title}
                </h3>
                <p className="text-[#F2F5F9]">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
