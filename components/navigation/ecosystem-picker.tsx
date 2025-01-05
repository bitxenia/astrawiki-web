"use client"
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import ExampleServer from "@/lib/ecosystems/example-server";

let selectedName = "";

export default function EcosystemPicker() {
    const { ecosystem, setEcosystem } = useContext<EcosystemContextProps>(EcosystemContext);
    const [triggerName, setTriggerName] = useState<string>("");

    useEffect(() => {
        setTriggerName(ecosystem ? selectedName : "Pick an ecosystem")
    }, [ecosystem])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="button">{triggerName}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                    setEcosystem(new ExampleServer());
                    selectedName = "Example Server";
                }}>
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
