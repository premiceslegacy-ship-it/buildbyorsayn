"use client";

import { AuthRouteError } from "@/components/account/AuthRouteError";

export default function UpdatePasswordError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <AuthRouteError {...props} title="La réinitialisation ne répond pas" />;
}
