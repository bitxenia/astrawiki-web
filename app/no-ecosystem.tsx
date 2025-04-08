import EcosystemPicker from "@/components/navigation/ecosystem-picker";

export default function NoEcosystem() {
  return (
    <div className="flex min-h-[82vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">Error</h1>
      <p className="text-foreground mb-8 max-w-[600px] sm:text-base">
        Please select an ecosystem first.
      </p>
      <div className="flex items-center">
        <EcosystemPicker />
      </div>
    </div>
  );
}
