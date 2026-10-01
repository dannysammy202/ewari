"use client";

import { useEffect } from "react";

type IconProps = {
  name: string;
  size?: number;
  active?: boolean;
  color?: string;
};

export function Icon({ name, size = 22, active = false, color = "currentColor" }: IconProps) {
  useEffect(() => {
    import("iconsax").catch(() => undefined);
  }, []);

  return <iconsax-icon name={name} type={active ? "bold" : "linear"} size={size} color={color} />;
}
