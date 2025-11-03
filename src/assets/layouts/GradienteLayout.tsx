interface GradienteLayoutProps {
  children: React.ReactNode;
}

export function GradienteLayout({ children }: GradienteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-l from-indigo-800 to-green-500 items-center justify-center p-4 relative">
      {children}
    </div>
  );
}
