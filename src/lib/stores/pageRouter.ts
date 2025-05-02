// src/lib/stores/pageRouter.ts
import { writable } from "svelte/store";

export const currentPage = writable("about-me");
export const flipping = writable(false);
