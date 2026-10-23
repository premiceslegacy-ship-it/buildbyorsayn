import type { ReactNode } from "react";
import { AppExperience } from "@/components/ui/AppExperience";

export default function Template({ children }: { children: ReactNode }) {
  return <AppExperience>{children}</AppExperience>;
}
