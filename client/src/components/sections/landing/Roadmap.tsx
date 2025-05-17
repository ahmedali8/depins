import { SectionHeading } from "@/components/molecules";

export default function Roadmap() {
  const milestones = [
    {
      period: "Q2 2025",
      items: [
        "Launch Meta-Vault with Grass integration",
        "AI optimizer live for bandwidth-based staking",
      ],
    },
    {
      period: "Q3 2025",
      items: ["Integrate Render + Nosana", "Launch stBASKET (DePIN ETF token)"],
    },
    {
      period: "Q4 2025",
      items: [
        "Full SDK integration for DePIN onboarding",
        "SOC-2 Type I & CASP compliance in EU",
      ],
    },
    {
      period: "Q1 2026",
      items: [
        "Cross-chain restaking support",
        "AI-driven DAO treasury staking",
      ],
    },
    {
      period: "2026+",
      items: [
        "Position dPINs.ai as the default DePIN orchestration layer across Web3",
      ],
    },
  ];

  return (
    <section
      id="roadmap"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="Where We're Headed"
        subtitle="Here's what we've built—and what's coming next."
        centered
      />

      <div className="mt-16 relative">
        {/* Horizontal line for desktop */}
        <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-[#A3B1C6]" />

        <div className="grid md:grid-cols-5 gap-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative">
              {/* Vertical line for mobile */}
              <div className="md:hidden absolute top-0 bottom-0 left-4 w-0.5 bg-[#A3B1C6]" />

              <div className="flex flex-col items-center text-center md:text-left">
                <div className="z-10 w-16 h-16 rounded-full bg-gradient-to-r from-[#5ED3F3] to-[#00FFAA] flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-[#0B0F1C] font-semibold text-lg">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#F2F5F9]">
                  {milestone.period}
                </h3>
                <ul className="space-y-2">
                  {milestone.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-[#5ED3F3] mr-2">→</span>
                      <span className="text-[#F2F5F9] text-left">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
