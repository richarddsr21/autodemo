import type { Metadata } from "next";
import { SettingsPage } from "@/features/definicoes/settings-form";

export const metadata: Metadata = { title: "Definições" };

export default function DefinicoesPage() {
  return <SettingsPage />;
}
