import assert from "node:assert/strict";
import test from "node:test";
import { isValidElement, type ReactNode } from "react";

import { McpConnectorShowcase } from "@/components/McpConnectorShowcase";

function findAssetImage(node: ReactNode): { src?: unknown; unoptimized?: unknown } | null {
  if (!isValidElement(node)) return null;

  const props = node.props as {
    children?: ReactNode;
    src?: unknown;
    unoptimized?: unknown;
  };
  if (props.src === "/api/mcp/showcase-asset") return props;

  const children = Array.isArray(props.children) ? props.children : [props.children];
  for (const child of children) {
    const match = findAssetImage(child);
    if (match) return match;
  }
  return null;
}

test("the rendered showcase bypasses Next image optimization for the revocable asset", () => {
  const assetImage = findAssetImage(McpConnectorShowcase());

  assert.ok(assetImage);
  assert.equal(assetImage.src, "/api/mcp/showcase-asset");
  assert.equal(assetImage.unoptimized, true);
});
