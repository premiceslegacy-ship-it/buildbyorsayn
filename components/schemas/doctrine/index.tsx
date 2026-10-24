import { createCourseVisualComponent } from "../protocole/kit-instance";
import { doctrine01 } from "./01-introduction";
import { doctrine02 } from "./02-parcours";
import { doctrine03 } from "./03-diagnostic";
import { doctrine04 } from "./04-decomposition";
import { doctrine05 } from "./05-connaissance";
import { doctrine06 } from "./06-boucle";
import { doctrine07 } from "./07-autorite";
import { doctrine08 } from "./08-preuve";
import { doctrine09 } from "./09-transmission";
import { doctrine10 } from "./10-ateliers";
import { doctrine11 } from "./11-message";
import { doctrine12 } from "./12-qualification";
import { doctrine13 } from "./13-cerveau-federe";
import { doctrine14 } from "./14-poles";
import { doctrine15 } from "./15-formats";
import { doctrine16 } from "./16-competences";
import { doctrine17 } from "./17-outils";
import { doctrine18 } from "./18-workflows";
import { doctrine19 } from "./19-adoption";
import { doctrine20 } from "./20-modeles";
import { doctrine21 } from "./21-gouvernance";

const DOCTRINE_VISUAL_DEFINITIONS = [
  ...doctrine01, ...doctrine02, ...doctrine03, ...doctrine04, ...doctrine05, ...doctrine06, ...doctrine07,
  ...doctrine08, ...doctrine09, ...doctrine10, ...doctrine11, ...doctrine12, ...doctrine13, ...doctrine14,
  ...doctrine15, ...doctrine16, ...doctrine17, ...doctrine18, ...doctrine19, ...doctrine20, ...doctrine21,
] as const;

export const DOCTRINE_VISUAL_CATALOG = DOCTRINE_VISUAL_DEFINITIONS.map((definition) => ({
  ...definition,
  component: createCourseVisualComponent(definition, "doctrine"),
}));
