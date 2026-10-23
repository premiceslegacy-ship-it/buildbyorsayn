import { createCourseVisualComponent } from "../protocole/kit-instance";
import { INTRO_VISUALS } from "./introduction";

export const INTRO_VISUAL_DEFINITIONS = INTRO_VISUALS;
export const INTRO_VISUAL_CATALOG = INTRO_VISUALS.map((definition) => ({
  ...definition,
  component: createCourseVisualComponent(definition, "intro"),
}));
