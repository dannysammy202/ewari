"use client";

import "iconsax";

type IconProps = {
  name: string;
  size?: number;
  active?: boolean;
  color?: string;
};

export function Icon({ name, size = 22, active = false, color = "currentColor" }: IconProps) {
  return <iconsax-icon name={name} type={active ? "bold" : "linear"} size={size} color={color} />;
}
