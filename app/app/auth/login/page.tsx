
import { CompactLoginForm } from "@/components/auth/compact-login-form"
import { DemoUserSimulator } from "@/components/auth/demo-user-simulator"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout>
      <CompactLoginForm />
      <DemoUserSimulator />
    </AuthLayout>
  )
}
