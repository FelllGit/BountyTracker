import { icons } from "lucide-react";

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

// Define a type for the icons object based on the module's export
type IconsType = {
  [key: string]: React.ComponentType<{ color?: string; size?: number }>;
};

// Cast the imported icons to the defined type
const typedIcons: IconsType = icons as IconsType;

const Icon: React.FC<IconProps> = ({ name, color, size, className }) => {
  const LucideIcon = typedIcons[name];

  // Handle the case where the icon name is not found
  if (!LucideIcon) {
    return null; // or you can return a default icon or an error icon
  }

  return (
    <div className={className}>
      <LucideIcon color={color} size={size} />
    </div>
  );
};

export default Icon;
