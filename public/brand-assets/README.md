# BUILD MCP connector asset

The delivered visual follows a three-stage process:

1. A 1600 × 900 raster composition places the owner-approved BUILD logo as the dominant method layer, with repository copies of the Claude and ChatGPT symbols connected as secondary assistant inputs over a detailed mountain landscape.
2. The complete raster is imported into ASCII Magic and exported with the `Characters` style at 2× resolution. This produces the character treatment for the landscape, connections and node silhouettes.
3. The repository source marks are then composited back over their processed silhouettes at the same positions. This keeps their stored geometry unmodified; it does not establish source authenticity, trademark permission or co-brand approval.

Files:

- `private/brand-assets/build-mcp-connector-source.png`: source raster kept outside `public/` and never served.
- `private/brand-assets/build-mcp-connector-characters.webp`: optimized 3200 × 1800 version served only by `/api/mcp/showcase-asset` after the launch gate is true.

Landscape source: [Cloudy mountain scenery](https://commons.wikimedia.org/wiki/File:Cloudy_mountain_scenery_(Unsplash).jpg), Nathan Anderson, released under CC0 1.0.

Mark traceability:

- BUILD: owner-provided approved master `BUILD LOGO.png`, SHA-256 `7f6e9e10cba73dbd012d272726d906de087cdca153f2960b267e1cf81429b187`. Proprietary BUILD mark, authorized only for this project.
- Claude: repository copy traced to [Wikimedia Commons file `Claude AI symbol.svg`](https://commons.wikimedia.org/wiki/File:Claude_AI_symbol.svg), source attributed there to Anthropic, revision dated 28 April 2026, SHA-256 `5de1221c77cc91e748066fd642ad0eee1c1fa65328814f5178166f901e599709`, file released there under CC0 1.0. This is not evidence of Anthropic trademark permission or brand approval.
- ChatGPT: repository source `public/brand-logos/chatgpt.svg`, SHA-256 `d4bb99346a264aca1072e6b6c2f2f5d0925a511c668a12a7b99451eaa7f8d4b8`. No official downloadable source revision or commercial co-brand approval is evidenced in this repository. Usage remains governed by the [OpenAI brand guidelines](https://openai.com/brand); ChatGPT and the mark remain OpenAI trademarks.

The Claude and ChatGPT marks identify intended compatibility with third-party assistants. They are not BUILD branding and do not imply endorsement or partnership. This co-branded asset must remain unpublished until current source authenticity, trademark terms and any required brand approval are documented. `NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED` must remain `false` until that review and the real client tests are complete.
