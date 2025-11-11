export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12">
      <div className="flex flex-col gap-6 w-full max-w-md">{children}</div>
    </main>
  );
}
