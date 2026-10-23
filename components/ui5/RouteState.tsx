"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RouteState({ code, title, message }: { code: string; title: string; message: string }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;
    void createClient().auth.getSession().then(({ data }) => {
      if (active) setLoggedIn(Boolean(data.session));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  return <main className="page-state"><div className="page-state__in"><span className="t-meta">{code}</span><h1 className="t-1">{title}</h1><p>{message}</p><Link className="btn btn--p" href={loggedIn ? "/dashboard" : "/"}>{loggedIn ? "Retour à Aujourd’hui" : "Retour à l’accueil"}</Link></div></main>;
}
