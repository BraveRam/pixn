"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

import React from "react";

const ButtonComponent = () => {
  const supabase = createClient();
  return (
    <Button onClick={() => supabase.auth.signOut()} className="bg-blue-500">
      Sign out
    </Button>
  );
};

export default ButtonComponent;
