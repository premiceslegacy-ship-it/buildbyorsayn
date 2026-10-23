import { PageLoading } from "@/components/ui/PageLoading";

export default function ForgotPasswordLoading() {
  return <PageLoading kind="auth" chrome={false} message="On prépare la récupération." />;
}
