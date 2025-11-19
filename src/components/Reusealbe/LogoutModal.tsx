"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutModal() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirect to home page after logout
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="px-6">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white cursor-pointer">
            <LogOut className="h-5 w-5" />
            <span className="font-normal text-base leading-[120%]">Log Out</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleLogout} // <-- Sign out action
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
