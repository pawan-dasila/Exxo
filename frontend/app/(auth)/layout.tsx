import { AuthShowcase } from "@/components/layout/auth/AuthShowcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-white font-sans selection:bg-black selection:text-white overflow-hidden relative">
      <main
        id="main-content"
        role="main"
        className="w-full lg:w-[50%] flex flex-col items-center justify-center relative animate-fade-in-up bg-white overflow-y-auto px-8 sm:px-16 md:px-24 scrollbar-hide"
      >
        <div className="max-w-md w-full mx-auto">{children}</div>
      </main>

      <AuthShowcase image="/assets/auth-1.png" />
    </div>
  );
}
