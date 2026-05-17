import { Layers, Fingerprint, Gift } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "PREMIUM BUILD",
    description:
      "High GSM fabric with structured oversized fit. Built to hold shape.",
  },
  {
    icon: Fingerprint,
    title: "DESIGNED WITH INTENT",
    description: "Every graphic, every placement, every detail is deliberate.",
  },
  {
    icon: Gift,
    title: "PACKAGING EXPERIENCE",
    description:
      "Not just delivered. Presented. The experience starts before the product.",
  },
];
export function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {FEATURES.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-3 md:gap-5 p-4 md:p-7 bg-[#F9F9F9] rounded-sm hover:bg-[#F3F3F3] transition-colors duration-300 group"
        >
          <div className="shrink-0">
            <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-gray-900 stroke-[1.2px] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col gap-0.5 md:gap-1">
            <h5 className="font-montserrat text-[11px] md:text-[13px] font-bold uppercase tracking-[0.05em] text-black leading-tight">
              {feature.title}
            </h5>
            <p className="text-[11px] md:text-[12px] text-gray-500 font-normal leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
