import "server-only";

import { SectionMindset } from "./sections/SectionMindset";
import { SectionPsychologie } from "./sections/SectionPsychologie";
import { SectionCopywriting } from "./sections/SectionCopywriting";
import { SectionVente } from "./sections/SectionVente";
import { SectionMarketing } from "./sections/SectionMarketing";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { SectionSiteWeb } from "./sections/SectionSiteWeb";
import { Section4 } from "./sections/Section4";
import type { BeginnerSectionId } from "./sections.data";

type SectionContentProps = {
  id: Exclude<BeginnerSectionId, "angle-mort">;
};

export function SectionContent({ id }: SectionContentProps) {
  switch (id) {
    case "mindset":
      return <SectionMindset />;
    case "psychologie":
      return <SectionPsychologie />;
    case "copywriting":
      return <SectionCopywriting />;
    case "vente":
      return <SectionVente />;
    case "marketing":
      return <SectionMarketing />;
    case "penser":
      return <Section1 />;
    case "environnement":
      return <Section2 />;
    case "visuels":
      return <Section3 />;
    case "site-web":
      return <SectionSiteWeb />;
    case "url":
      return <Section4 />;
  }
}
