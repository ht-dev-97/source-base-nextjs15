import { CloseCircleIcon, UserIcon } from "@/assets/icons";
import { SVGProps } from "@/types";
import React from "react";

const ICON_COMPONENTS = {
  "close-circle": CloseCircleIcon,
  user: UserIcon,
} as const;

type IconName = keyof typeof ICON_COMPONENTS;

interface IconProps extends SVGProps {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = ICON_COMPONENTS[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
};
