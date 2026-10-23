"use client";

import { AuthRouteError } from "@/components/account/AuthRouteError";

export default function ForgotPasswordError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <AuthRouteError {...props} title="La récupération ne répond pas" />;
}
