import { 
  Brush, Droplets, Flower2, Hand, Scissors, Sparkles, Waves, Briefcase,
  Leaf, Gem, Heart, Star, Award, Gift, Palette, Paintbrush, ShoppingBag, 
  Sun, Moon, Wind, Smile, Feather,
  Bath, Eye, Crown, Zap, HeartHandshake, Syringe,
  ScissorsLineDashed, Activity, Droplet
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { id: "sparkles", label: "Estética", icon: Sparkles },
  { id: "scissors", label: "Peluquería", icon: Scissors },
  { id: "brush", label: "Maquillaje", icon: Brush },
  { id: "droplets", label: "Lavado", icon: Droplets },
  { id: "waves", label: "Tratamientos", icon: Waves },
  { id: "hand", label: "Manicura", icon: Hand },
  { id: "flower", label: "Bienestar", icon: Flower2 },
  { id: "leaf", label: "Natural", icon: Leaf },
  { id: "gem", label: "Premium", icon: Gem },
  { id: "heart", label: "Favorito", icon: Heart },
  { id: "star", label: "Estrella", icon: Star },
  { id: "award", label: "Especial", icon: Award },
  { id: "gift", label: "Regalo", icon: Gift },
  { id: "palette", label: "Colorimetría", icon: Palette },
  { id: "paintbrush", label: "Diseño", icon: Paintbrush },
  { id: "shopping-bag", label: "Productos", icon: ShoppingBag },
  { id: "sun", label: "Día", icon: Sun },
  { id: "moon", label: "Noche", icon: Moon },
  { id: "wind", label: "Secado", icon: Wind },
  { id: "smile", label: "Facial", icon: Smile },
  { id: "feather", label: "Depilación", icon: Feather },
  { id: "bath", label: "Spa", icon: Bath },
  { id: "eye", label: "Pestañas/Cejas", icon: Eye },
  { id: "crown", label: "VIP", icon: Crown },
  { id: "zap", label: "Láser", icon: Zap },
  { id: "heart-handshake", label: "Cuidado", icon: HeartHandshake },
  { id: "syringe", label: "Inyectables", icon: Syringe },
  { id: "scissors-line-dashed", label: "Corte", icon: ScissorsLineDashed },
  { id: "activity", label: "Masajes", icon: Activity },
  { id: "droplet", label: "Cuidado Piel", icon: Droplet },
];

export const workshopIconMap = AVAILABLE_ICONS.reduce((acc, curr) => {
  acc[curr.id] = curr.icon;
  return acc;
}, {});

export const courseIconMap = workshopIconMap;
