import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartScan = () => navigate("/download");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F1C]/80 backdrop-blur-md border-b border-[#A3B1C6]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-[#5ED3F3] to-[#00FFAA] bg-clip-text text-transparent">
            DePINs
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {["problem", "how-it-works", "features", "ecosystem", "roadmap"].map(
            (section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-[#A3B1C6] hover:text-[#F2F5F9] transition-colors"
              >
                {section
                  .split("-")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
              </a>
            )
          )}
          <Button
            className="cursor-pointer bg-gradient-to-r from-[#5ED3F3] to-[#00FFAA] hover:from-[#4BC3E3] hover:to-[#00E699]"
            onClick={handleStartScan}
          >
            Start the Scan
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#F2F5F9] focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0E1729] border-b border-[#A3B1C6]">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {[
              "problem",
              "how-it-works",
              "features",
              "ecosystem",
              "roadmap",
            ].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-[#A3B1C6] hover:text-[#F2F5F9] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {section
                  .split("-")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
              </a>
            ))}
            <Button
              className="bg-gradient-to-r from-[#5ED3F3] to-[#00FFAA] hover:from-[#4BC3E3] hover:to-[#00E699] w-full"
              onClick={() => {
                setIsOpen(false);
                handleStartScan();
              }}
            >
              Start the Scan
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
