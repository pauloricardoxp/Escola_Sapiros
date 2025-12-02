interface GradienteLayoutProps {
  children: React.ReactNode;
}

export function GradienteLayout({ children }: GradienteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-l from-[#063149] to-[#37ADED] items-center justify-center p-4 relative">
      {children}
    </div>
  );
}
