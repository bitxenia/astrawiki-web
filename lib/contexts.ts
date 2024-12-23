import { createContext } from "react";
import { Ecosystem } from "./ecosystems/ecosystem";
import ExampleServer from "./ecosystems/example-server";

export const EcosystemContext = createContext<Ecosystem>(new ExampleServer());
