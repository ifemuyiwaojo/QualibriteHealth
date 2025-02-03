import { useAuth } from "@/lib/auth";
import { TelehealthSession } from "@/components/TelehealthSession";

export default function TelehealthPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Video Visit</h1>
      <TelehealthSession isProvider={user.role === 'provider'} />
    </div>
  );
}
