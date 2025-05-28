import {
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Dialog } from "../ui/dialog";
import { useState } from "react";
import { buttonVariants } from "../ui/button";
import toast from "react-hot-toast";

export type LoginProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoginDone: (done: boolean) => void;
  setLoginKey: (loginKey: string) => void;
};

export function Login({
  open,
  setOpen,
  setLoginDone,
  setLoginKey,
}: LoginProps) {
  const [localLoginKey, setLocalLoginKey] = useState<string>("");

  const onLogin = () => {
    if (localLoginKey.length === 0) {
      toast.error("Login key cannot be empty");
      return;
    }
    setLoginKey(localLoginKey);
    setOpen(false);
    setLoginDone(true);
  };

  const onRegister = () => {
    setOpen(false);
    setLoginDone(true);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="fixed left-1/2 top-1/2 z-[9999] min-w-[600px] max-w-[650px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg border bg-white px-4 pb-4 pt-1 dark:bg-black">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="flex flex-col gap-3">
          <input
            value={localLoginKey}
            onChange={(e) => setLocalLoginKey(e.target.value)}
            placeholder="Input login key..."
            type="password"
            autoFocus
            className="h-14 border-b bg-transparent text-[15px] outline-none"
          />
          <div className="justify-right flex gap-2">
            <DialogClose
              className={buttonVariants({
                variant: "default",
                size: "default",
              })}
              onClick={onLogin}
            >
              Login
            </DialogClose>
            <DialogClose
              className={buttonVariants({
                variant: "secondary",
                size: "default",
              })}
              onClick={onRegister}
            >
              Register
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
