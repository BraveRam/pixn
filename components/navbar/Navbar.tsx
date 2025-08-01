import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "../ui/button";
import MobileMenu from "./MobileMenu";
import { redirect } from "next/navigation";

const signOut = async () => {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
};

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name ?? "";

  return (
    <nav className="bg-black/80 backdrop-blur-md text-white flex items-center justify-between px-6 py-4 border-b border-white/10 fixed top-0 left-0 right-0 z-50 shadow-md">
      <Link href="/">
        <h1 className="font-bold text-3xl">Pixn</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/upload">
          <Button className="bg-blue-500 text-white font-extrabold hover:bg-blue-700">
            Upload
          </Button>
        </Link>
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/gallery">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/fav">
            <Button variant="outline">Favorites</Button>
          </Link>
          <p className="font-bold">{fullName}</p>
          <form action={signOut}>
            <Button variant={"destructive"} type="submit">
              Sign Out
            </Button>
          </form>
        </div>

        <div className="sm:hidden">
          <MobileMenu fullName={fullName} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
