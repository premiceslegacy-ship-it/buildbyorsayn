"use client";

import { useState, useEffect } from "react";
import { BLOCS_DATA } from "@/lib/mockData";

export function useProgress() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [lastVisitedBloc, setLastVisitedBlocState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("build_progress");
    const savedBloc = localStorage.getItem("build_last_visited");
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    if (savedBloc) {
      setLastVisitedBlocState(savedBloc);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("build_progress", JSON.stringify(checkedItems));
    }
  }, [checkedItems, isLoaded]);

  const setLastVisitedBloc = (blocId: string) => {
    setLastVisitedBlocState(blocId);
    localStorage.setItem("build_last_visited", blocId);
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

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
