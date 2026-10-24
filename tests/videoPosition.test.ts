import assert from "node:assert/strict";
import test from "node:test";
import { nextVideoPosition } from "../lib/mux/videoPosition";

test("la position suivante mappe le numéro affiché vers le bloc interne", () => {
  const videos = [
    { bloc_id: "5", position: 1 },
    { bloc_id: "5", position: 4 },
    { bloc_id: "3", position: 2 },
  ];
  assert.equal(nextVideoPosition(videos, 3), 5);
  assert.equal(nextVideoPosition(videos, 4), 3);
});

test("la position suivante traite le protocole comme un emplacement distinct", () => {
  const videos = [{ bloc_id: "protocole", position: 2 }, { bloc_id: "5", position: 8 }];
  assert.equal(nextVideoPosition(videos, "protocole"), 3);
  assert.equal(nextVideoPosition(videos, 7), 1);
});
