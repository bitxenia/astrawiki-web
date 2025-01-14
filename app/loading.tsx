import { BarLoader } from "react-spinners";

export default function Loading({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="min-h-[86.5vh] flex flex-col justify-center items-center text-center px-2 py-8">
            <h1 className="text-4xl font-bold mb-4 sm:text-7xl">
                {title}
            </h1>
            <p className="max-w-[600px] text-foreground mb-8 sm:text-base">
                {desc}
            </p>
        </div>
    );
}
