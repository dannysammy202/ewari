import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "iconsax-icon": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
        type?: "linear" | "bold" | "broken" | "bulk" | "outline" | "twotone";
        size?: string | number;
        color?: string;
      };
    }
  }
}

export {};
