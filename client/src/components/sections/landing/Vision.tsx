import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/molecules";

export default function Vision() {
  return (
    <section
      id="vision"
      className="py-20 px-4 md:px-8 container mx-auto bg-gradient-to-b from-[#0B0F1C] to-[#0A0F1C]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeading
          title="The Future of Stakeable Infrastructure"
          centered
        />

        <div className="mt-8 mb-12 space-y-6">
          <p className="text-xl text-[#A3B1C6]">
            We believe every organization—no matter the size—has untapped
            potential.
          </p>
          <p className="text-xl text-[#A3B1C6]">
            dPINs.ai is here to unlock it.
          </p>
          <p className="text-xl text-[#A3B1C6]">
            We activate idle infrastructure and plug it directly into
            yield-generating DePINs and staking protocols.
          </p>
          <p className="text-xl font-semibold text-[#F2F5F9] mt-8">
            Secure. Automated. Non-custodial.
          </p>
          <p className="text-2xl font-bold text-[#F2F5F9] mt-8">
            It's time to turn your infra into income.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button className="bg-gradient-to-r from-[#5ED3F3] to-[#00FFAA] hover:from-[#4BC3E3] hover:to-[#00E699] text-[#0B0F1C] text-lg py-6 px-8 font-semibold">
            Try the Demo
          </Button>
          <Button
            variant="outline"
            className="text-lg py-6 px-8 border-[#A3B1C6] text-[#F2F5F9] hover:bg-[#1a2235]"
          >
            Join Waitlist
          </Button>
          <Button
            variant="ghost"
            className="text-lg py-6 px-8 text-[#F2F5F9] hover:bg-[#1a2235]"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
