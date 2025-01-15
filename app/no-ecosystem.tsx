import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import EcosystemPicker from "@/components/navigation/ecosystem-picker";

export default function NoEcosystem() {
    return (
        <div className="min-h-[82vh] flex flex-col justify-center items-center text-center px-2 py-8">
            <h1 className="text-4xl font-bold mb-4 sm:text-7xl">
                Error
            </h1>
            <p className="max-w-[600px] text-foreground mb-8 sm:text-base">
                Please select an ecosystem first.
            </p>
            <div className="flex items-center">
                <EcosystemPicker />
            </div>
        </div>
    );
}
