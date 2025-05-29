import AnagramMachine from "@/components/AnagramMachine";
import RLEMachine from "@/components/RLEMachine";

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-800 py-10 px-2 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-56">
      <div className="w-full md:w-auto max-w-md">
        <AnagramMachine />
      </div>
      <div className="w-full md:w-auto max-w-md">
        <RLEMachine />
      </div>
    </main>
  );
}
