export default function Loading({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="flex min-h-[82vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">{title}</h1>
      <p className="mb-8 max-w-[600px] text-foreground sm:text-base">{desc}</p>
    </div>
  );
}
