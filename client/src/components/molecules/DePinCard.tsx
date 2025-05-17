interface DePINCardProps {
  name: string;
  status: string;
  onClick: () => void;
}

export default function DePinCard({
  name,
  status,
  onClick,
}: Readonly<DePINCardProps>) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-700/50 rounded-xl bg-gray-800/80 mb-4 hover:bg-gray-800 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-amber-900/10 group cursor-pointer">
      <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-800/30 to-amber-600/20 flex items-center justify-center mr-3 sm:mr-4 border border-amber-500/30 shadow-inner group-hover:border-amber-500/50 transition-all duration-300">
          <span className="text-amber-400 font-medium text-base sm:text-lg">
            {name.charAt(0)}
          </span>
        </div>
        <span className="font-medium text-gray-100 tracking-wide font-display text-sm sm:text-base">
          {name}
        </span>
      </div>
      <button
        onClick={onClick}
        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 w-full sm:w-auto ${
          status === "available"
            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 hover:from-amber-400 hover:to-amber-500 shadow-md hover:shadow-amber-500/20"
            : "bg-gray-700/80 text-gray-400 border border-gray-600/50 hover:bg-gray-700"
        }`}
        disabled={status !== "available"}
      >
        {status === "available" ? "Setup" : "Coming Soon"}
      </button>
    </div>
  );
}
