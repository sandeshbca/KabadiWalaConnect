"use client";

import { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { ImageLightboxHost } from "@/components/ui/ImageLightbox";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <ImageLightboxHost />
    </I18nProvider>
  );
}
