import { PageLoading } from "@/components/ui/PageLoading";

export default function UpdatePasswordLoading() {
  return <PageLoading kind="auth" chrome={false} message="On prépare ton nouveau mot de passe." />;
}
