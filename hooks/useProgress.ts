"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BLOCS_DATA } from "@/lib/mockData";
import { createClient } from "@/lib/supabase/client";

export function useProgress() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [lastVisitedBloc, setLastVisitedBlocState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ─── Load : user + progress from Supabase ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      // Récupère la session / l'utilisateur
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Session invalide:", userError?.message);
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Récupère les lignes progress de cet utilisateur
      const { data, error } = await supabase
        .from("progress")
        .select("item_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erreur lors du chargement de la progression:", error.message);
      } else if (data) {
        setCheckedItems(data.map((row: { item_id: string }) => row.item_id));
      }

      // lastVisitedBloc reste dans localStorage (préférence d'UI, non critique)
      const savedBloc = localStorage.getItem("build_last_visited");
      if (savedBloc) setLastVisitedBlocState(savedBloc);

      setIsLoaded(true);
    };

    load();
  }, [router]);

  // ─── setLastVisitedBloc ─────────────────────────────────────────────────────
  const setLastVisitedBloc = (blocId: string) => {
    setLastVisitedBlocState(blocId);
    localStorage.setItem("build_last_visited", blocId);
  };

  // ─── toggleItem : UI Optimiste + Supabase en arrière-plan ──────────────────
  const toggleItem = useCallback(
    async (itemId: string) => {
      if (!userId) return;

      const isChecked = checkedItems.includes(itemId);

      // 1. Mise à jour optimiste immédiate
      setCheckedItems((prev) =>
        isChecked ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );

      const supabase = createClient();
      // Le module_id est le préfixe de l'item (ex: "b1" pour "b1-s1")
      const moduleParts = itemId.split("-");
      const moduleId = moduleParts[0]; // "b1", "b2", etc.

      if (isChecked) {
        // 2a. Décochage → DELETE
        const { error } = await supabase
          .from("progress")
          .delete()
          .eq("user_id", userId)
          .eq("item_id", itemId);

        if (error) {
          console.error("Erreur lors de la suppression de la progression:", error.message);
          // Rollback optimiste
          setCheckedItems((prev) => [...prev, itemId]);
        }
      } else {
        // 2b. Cochage → INSERT
        const { error } = await supabase.from("progress").insert({
          user_id: userId,
          module_id: moduleId,
          item_id: itemId,
        });

        if (error) {
          console.error("Erreur lors de l'enregistrement de la progression:", error.message);
          // Rollback optimiste
          setCheckedItems((prev) => prev.filter((id) => id !== itemId));
        }
      }
    },
    [checkedItems, userId]
  );

  // ─── Calculs de progression ─────────────────────────────────────────────────
  const totalItems = BLOCS_DATA.reduce(
    (acc, bloc) => acc + bloc.sections.length,
    0
  );

  const globalProgress =
    totalItems === 0 ? 0 : Math.round((checkedItems.length / totalItems) * 100);

  const getBlocProgress = (blocId: string) => {
    const bloc = BLOCS_DATA.find((b) => b.id === blocId);
    if (!bloc || bloc.sections.length === 0) return 0;
    const completedInBloc = bloc.sections.filter((s) =>
      checkedItems.includes(s.id)
    ).length;
    return Math.round((completedInBloc / bloc.sections.length) * 100);
  };

  return {
    checkedItems,
    toggleItem,
    globalProgress,
    getBlocProgress,
    isLoaded,
    lastVisitedBloc,
    setLastVisitedBloc,
  };
}
