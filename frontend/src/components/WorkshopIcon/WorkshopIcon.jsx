import { Briefcase } from "lucide-react";
import { workshopIconMap } from "../../constants/icons";

export default function WorkshopIcon({ iconName, fallbackIcon: FallbackIcon = Briefcase, ...props }) {
  const IconComponent = workshopIconMap[iconName] ?? FallbackIcon;
  return <IconComponent {...props} />;
}