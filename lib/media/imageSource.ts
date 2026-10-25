/** Une miniature hébergée hors du site (Supabase, Mux) ne passe pas par l'optimiseur local : on la sert telle quelle. */
export function isRemoteImage(src: string | null | undefined): boolean {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}
