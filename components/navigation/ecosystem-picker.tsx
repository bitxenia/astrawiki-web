"use client"
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useContext } from "react";
import ExampleServer from "@/lib/ecosystems/example-server";

export default function EcosystemPicker() {
    const { setEcosystem, setIsESLoading, esName, setESName } = useContext<EcosystemContextProps>(EcosystemContext);

    const setExampleServer = async () => {
        setIsESLoading(true);
        setESName('Loading...');
        const es = new ExampleServer();
        await es.init()
        setEcosystem(es);
        setESName('Example Server');
        setIsESLoading(false);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="button">
                <div className="border border-black/20 rounded-lg px-2 py-1">
                    {esName}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={setExampleServer}>
                    Example Server
                </DropdownMenuItem>
                <DropdownMenuItem>
                    IPFS
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Blockchain
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Freenet
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
