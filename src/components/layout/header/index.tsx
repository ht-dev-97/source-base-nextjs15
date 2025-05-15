"use client";

import React from "react";
import { ModeToggle } from "./mode-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Header");

  return (
    <header className="shadow-lg py-4">
      <div className="wrapper">
        <div className="flex-between">
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold">
              {t("title")}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
