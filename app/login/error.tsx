"use client";

import { AuthRouteError } from "@/components/account/AuthRouteError";

export default function LoginError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <AuthRouteError {...props} title="La connexion ne répond pas" />;
}
