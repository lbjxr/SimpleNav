import * as Icons from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const LucideIcon = ({ name, className = "", size = 20 }: IconProps) => {
  // Safe dynamic resolution of Lucide icon by string name
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // fallback to generic Link icon if name is missing or invalid
    const Fallback = Icons.Link;
    return <Fallback className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};

// Expose a list of beautifully designed icons for category selection
export const AVAILABLE_ICONS = [
  "Flame",
  "Search",
  "Code",
  "Briefcase",
  "Sparkles",
  "Layout",
  "Compass",
  "Link",
  "BookOpen",
  "Music",
  "Video",
  "Gamepad2",
  "ShoppingBag",
  "Terminal",
  "Newspaper",
  "Landmark",
  "Heart",
  "Info",
  "Globe",
  "Coffee",
  "GraduationCap",
  "Cloud",
  "Laptop",
  "Layers"
];
