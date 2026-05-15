import { Brush, Droplets, Flower2, Hand, Scissors, Sparkles, Waves, Briefcase } from "lucide-react";

export const workshopIconMap = {
  brush: Brush,
  droplets: Droplets,
  flower: Flower2,
  hand: Hand,
  scissors: Scissors,
  sparkles: Sparkles,
  waves: Waves,
};

export default function WorkshopIcon({ iconName, fallbackIcon: FallbackIcon = Briefcase, ...props }) {
  const IconComponent = workshopIconMap[iconName] ?? FallbackIcon;
  return <IconComponent {...props} />;
}