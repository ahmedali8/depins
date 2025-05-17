interface YieldStatProps {
  label: string;
  amount: string;
  className?: string;
}

export default function YieldStat({
  label,
  amount,
  className = "",
}: Readonly<YieldStatProps>) {
  return (
    <div className={`mb-4 ${className}`}>
      <p className="text-sm text-gray-400 mb-1 font-medium">{label}</p>
      <p className="text-lg sm:text-xl font-semibold text-gray-100 font-display">
        {amount} GRASS
      </p>
    </div>
  );
}
