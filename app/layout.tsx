export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="ru"><body className="max-w-3xl mx-auto">{children}</body></html>
  );
}
