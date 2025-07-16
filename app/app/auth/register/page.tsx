
import { CompactRegisterForm } from "@/components/auth/compact-register-form"
import { DemoUserSimulator } from "@/components/auth/demo-user-simulator"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function RegisterPage() {
  return (
    <AuthLayout>
      <CompactRegisterForm />
      <DemoUserSimulator />
    </AuthLayout>
  )
}
