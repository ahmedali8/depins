import { useState } from "react";
import { Clipboard } from "lucide-react";

interface WalletKeyCopyButtonProps {
  textToCopy: string;
  label: string;
}

export default function WalleyKeyCopyButton({
  textToCopy,
  label,
}: Readonly<WalletKeyCopyButtonProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers or insecure context
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div className="relative cursor-pointer">
      <button
        className=" px-6 py-2 rounded-md border border-gray-400 text-gray-100 flex items-center justify-center hover:bg-gray-800 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCopy}
      >
        <span className="mr-2">{label ? label : "Copy to Clipboard"}</span>
        <Clipboard className={`h-4 w-4 ${isHovered ? "animate-bounce" : ""}`} />
      </button>
      {isCopied && (
        <span className="absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
          Copied!
        </span>
      )}
    </div>
  );
}
