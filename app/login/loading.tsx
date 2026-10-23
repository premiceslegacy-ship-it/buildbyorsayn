import { PageLoading } from "@/components/ui/PageLoading";

export default function LoginLoading() {
  return <PageLoading kind="auth" chrome={false} message="On prépare la connexion." />;
}
