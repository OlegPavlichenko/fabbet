import Header from "@/components/Header";
export default function Home(){
  return (
    <main>
      <Header />
      <section className="p-4 space-y-3">
        <h2 className="text-2xl font-bold">Добро пожаловать в FabBet</h2>
        <p className="opacity-80">Здесь будут рекомендации по матчам и ваш трекер прогнозов.</p>
      </section>
    </main>
  );
}
