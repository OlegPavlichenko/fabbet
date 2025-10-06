export default function Header(){
  return (
    <header className="p-4 border-b flex items-center justify-between">
      <h1 className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <nav className="text-sm opacity-80">Прогнозы • Матчи</nav>
    </header>
  );
}
