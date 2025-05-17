import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 px-4 md:px-8 min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🔹 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video/demo2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Gradient Overlay — lighter to make video pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1C]/90 to-[#0B0F1C]/80 z-10" />

      {/* 🔹 Foreground Content */}
      <div className="relative z-20 container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[#F2F5F9] drop-shadow-md">
          Turn idle infrastructure into real Income.
        </h1>

        <p className="text-xl md:text-2xl text-[#A3B1C6] mb-8 leading-relaxed drop-shadow">
          We put to use surplus Resources & Digital Infra — Such as bandwidth,
          compute, storage, etc — Earned Rewards are programmatically staked,
          Restaked and farmed on Liquid Staking Protocols to further compound
          Rewards.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="text-lg py-6 px-8 bg-gradient-to-r from-[#5ED3F3] to-[#00FFAA] hover:from-[#4BC3E3] hover:to-[#00E699] text-[#0B0F1C] font-semibold"
            onClick={() => navigate("/download")}
          >
            Start the Scan
          </Button>
          <Button
            variant="outline"
            className="text-lg py-6 px-8 border-[#A3B1C6] text-[#F2F5F9] hover:bg-[#1a2235]"
          >
            <Play size={18} className="mr-2" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
