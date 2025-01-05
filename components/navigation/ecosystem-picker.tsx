import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function EcosystemPicker() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="button">Pick an ecosystem</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
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
