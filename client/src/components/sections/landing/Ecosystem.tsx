import { CheckCircle, Clock } from "lucide-react";
import { SectionHeading } from "@/components/molecules";

export default function Ecosystem() {
  const protocols = [
    {
      name: "Grass",
      description: "Share unused bandwidth, earn rewards.",
      status: "integrated",
    },
    {
      name: "Render",
      description: "Contribute GPU power for 3D rendering.",
      status: "in-progress",
    },
    {
      name: "Hivemapper",
      description: "Capture street-level imagery with a dashcam.",
      status: "in-progress",
    },
    {
      name: "Nosana",
      description: "Run CI/CD jobs using spare compute.",
      status: "in-progress",
    },
    {
      name: "Marinade",
      description: "Stake SOL via mSOL.",
      status: "integrated",
    },
    {
      name: "Picasso (Restaking)",
      description: "Secure additional services with your stake.",
      status: "pilot",
    },
  ];

  return (
    <section
      id="ecosystem"
      className="py-20 px-4 md:px-8 container mx-auto bg-[#0B0F1C]"
    >
      <SectionHeading
        title="Plugged Into the Solana Ecosystem"
        subtitle="We integrate directly with leading infrastructure networks—ready for yield, out of the box."
        centered
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {protocols.map((protocol, index) => (
          <div
            key={index}
            className="bg-[#0E1729] p-8 rounded-xl border border-[#A3B1C6]"
          >
            <h3 className="text-xl font-semibold mb-3 text-[#F2F5F9]">
              {protocol.name}
            </h3>
            <p className="text-[#F2F5F9] mb-4">{protocol.description}</p>
            <div className="flex items-center">
              {protocol.status === "integrated" ? (
                <>
                  <CheckCircle className="text-[#00FFAA] mr-2" size={18} />
                  <span className="text-[#00FFAA]">Integrated</span>
                </>
              ) : protocol.status === "pilot" ? (
                <>
                  <Clock className="text-[#FFD166] mr-2" size={18} />
                  <span className="text-[#FFD166]">Pilot Phase</span>
                </>
              ) : (
                <>
                  <Clock className="text-[#5ED3F3] mr-2" size={18} />
                  <span className="text-[#5ED3F3]">In Progress</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
