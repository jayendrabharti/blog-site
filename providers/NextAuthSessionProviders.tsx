"use client";
import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";
import { Session } from "next-auth";

interface NextAuthSessionProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export default function NextAuthSessionProviders({
  children,
  session,
}: NextAuthSessionProvidersProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
