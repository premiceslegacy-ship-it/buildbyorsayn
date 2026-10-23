export type KitBaseProps = {
  title: string;
  /** Une phrase qui explique le schéma, sous le titre. */
  description: string;
  ariaLabel: string;
  accent?: string;
  /** Phrase courte, en bas du schéma, qui dit comment le lire. */
  legend?: string;
};

export type KitTool = {
  name: string;
  label?: string;
};
