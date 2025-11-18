"use client"

import { useRouter } from "next/navigation"
import LoginPage from "./_components/LoginFrom"

export default function LoginRoute() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2332]">
      <LoginPage
        onSwitchToRegister={() => router.push("/signup")}
        onSwitchToForgotPassword={() => router.push("/forgot-password")}
      />
    </main>
  )
}
