import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

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

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
      <Link href="/">
        <h1 className="font-bold text-3xl">Pixn</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/upload" className="text-sm font-medium hover:underline">
          <Button className="bg-blue-500 text-white font-extrabold hover:bg-blue-700">
            Upload
          </Button>
        </Link>
        <Link
          prefetch
          href="/gallery"
          className="text-sm font-medium hover:underline"
        >
          <Button variant={"outline"}>Dashboard</Button>
        </Link>
        <Link
          prefetch
          href="/fav"
          className="text-sm font-medium hover:underline"
        >
          <Button variant={"outline"}>Favorites</Button>
        </Link>
        <p className="font-bold">{user?.user_metadata?.full_name}</p>
        <form action={signOut}>
          <Button type="submit">Sign Out</Button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
