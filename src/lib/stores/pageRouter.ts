// src/lib/stores/pageRouter.ts
import { writable } from "svelte/store";
import { navigation } from "@/data/navigation";

export const currentPage = writable("about-me");
export const flipping = writable(false);
export const currentChapter = writable<NavigationLink>(navigation[0]);
