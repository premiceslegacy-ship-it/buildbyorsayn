import { b1_s0_VISUALS } from "./b1-s0";
import { b1_s1_VISUALS } from "./b1-s1";
import { b1_s2_VISUALS } from "./b1-s2";
import { b1_s3_VISUALS } from "./b1-s3";
import { b1_s4_VISUALS } from "./b1-s4";
import { b1_s4b_VISUALS } from "./b1-s4b";
import { b2_s1_VISUALS } from "./b2-s1";
import { b2_s2_VISUALS } from "./b2-s2";
import { b2_s3_VISUALS } from "./b2-s3";
import { b3_s1_VISUALS } from "./b3-s1";
import { b3_s2_VISUALS } from "./b3-s2";
import { b3_s3_VISUALS } from "./b3-s3";
import { b4_s1_VISUALS } from "./b4-s1";
import { b4_s1b_VISUALS } from "./b4-s1b";
import { b4_s2_VISUALS } from "./b4-s2";
import { b4_s3_VISUALS } from "./b4-s3";
import { b5_s1_VISUALS } from "./b5-s1";
import { b5_s2_VISUALS } from "./b5-s2";
import { b5_s3_VISUALS } from "./b5-s3";
import { b5_s4_VISUALS } from "./b5-s4";
import { b6_s1_VISUALS } from "./b6-s1";
import { b6_s2_VISUALS } from "./b6-s2";
import { b6_s3_VISUALS } from "./b6-s3";
import { b6_s4_VISUALS } from "./b6-s4";
import { b6_s5_VISUALS } from "./b6-s5";
import { b7_s1_VISUALS } from "./b7-s1";
import { b7_s2_VISUALS } from "./b7-s2";
import { b7_s3_VISUALS } from "./b7-s3";
import { b7_s4_VISUALS } from "./b7-s4";
import { intro_1_VISUALS } from "./intro-1";
import { intro_2_VISUALS } from "./intro-2";
import { intro_3_VISUALS } from "./intro-3";
import { intro_4_VISUALS } from "./intro-4";
import { intro_5_VISUALS } from "./intro-5";
import { intro_6_VISUALS } from "./intro-6";
import { intro_7_VISUALS } from "./intro-7";
import { createCoffreVisualComponent } from "./render";

export const COFFRE_VISUAL_DEFINITIONS = [
  ...b1_s0_VISUALS,
  ...b1_s1_VISUALS,
  ...b1_s2_VISUALS,
  ...b1_s3_VISUALS,
  ...b1_s4_VISUALS,
  ...b1_s4b_VISUALS,
  ...b2_s1_VISUALS,
  ...b2_s2_VISUALS,
  ...b2_s3_VISUALS,
  ...b3_s1_VISUALS,
  ...b3_s2_VISUALS,
  ...b3_s3_VISUALS,
  ...b4_s1_VISUALS,
  ...b4_s1b_VISUALS,
  ...b4_s2_VISUALS,
  ...b4_s3_VISUALS,
  ...b5_s1_VISUALS,
  ...b5_s2_VISUALS,
  ...b5_s3_VISUALS,
  ...b5_s4_VISUALS,
  ...b6_s1_VISUALS,
  ...b6_s2_VISUALS,
  ...b6_s3_VISUALS,
  ...b6_s4_VISUALS,
  ...b6_s5_VISUALS,
  ...b7_s1_VISUALS,
  ...b7_s2_VISUALS,
  ...b7_s3_VISUALS,
  ...b7_s4_VISUALS,
  ...intro_1_VISUALS,
  ...intro_2_VISUALS,
  ...intro_3_VISUALS,
  ...intro_4_VISUALS,
  ...intro_5_VISUALS,
  ...intro_6_VISUALS,
  ...intro_7_VISUALS,
] as const;

export const COFFRE_VISUAL_CATALOG = COFFRE_VISUAL_DEFINITIONS.map((definition) => ({
  ...definition,
  component: createCoffreVisualComponent(definition),
}));
