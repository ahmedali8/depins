interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col ${
        centered ? "items-center text-center" : "items-start text-left"
      } mb-12`}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F2F5F9]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-[#A3B1C6] max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}
