"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            const response = await fetch("/api/auth/sign-out", {
                method: "POST",
            });

            if (response.ok) {
                router.push("/auth/sign-in");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to sign out", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>
                    Sign Out
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign out</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to sign out?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
