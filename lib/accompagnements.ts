export const ACCOMPANIMENT_CAL_URL = "https://cal.com/samuel-mbeboura/point-sur-ton-projet-de-site-web";

export type Accompagnement = {
  id: string;
  status: "available" | "soon";
  title: string;
  description: string;
  href?: string;
};
