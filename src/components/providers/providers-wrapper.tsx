import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

import buildProvidersTree from "./build-provider-tree";
import { ThemeProvider } from "./theme-provider";

interface ProvidersWrapperProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export function ProvidersWrapper({
  children,
  locale,
  messages,
}: ProvidersWrapperProps) {
  const ProvidersTree = buildProvidersTree([
    [NextIntlClientProvider, { locale, messages }],
    [ThemeProvider],
  ]);

  return <ProvidersTree>{children}</ProvidersTree>;
}
