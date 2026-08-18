---
name: ip-as-logo
description: Generate highly simplified personified IP mascot logos with Flat-first geometry, rounded heavy forms, and extremely subtle neo-skeuomorphic shading. Use when creating an animal, creature, robot, ghost, plant, object, or other character as a minimal square logo or app-icon artwork, especially when the user wants an oversized corner composition, one- or two-color IP design, and a solid background without an app-icon frame.
---

# IP as Logo

Create a logo first and a character second. Reduce the subject to a compact symbol that remains recognizable at `32 × 32`; do not produce a character illustration.

## Workflow

1. Ask before generating: `这次希望 IP 使用单色设计还是多色设计？` Skip only when the user already specified the color mode. Treat multicolor as two IP colors by default; use more only when explicitly requested.
2. Confirm the subject and solid background color. If the user supplies a background palette, reserve every supplied color for backgrounds only unless they explicitly say otherwise. Never move a background-only color into the IP, facial marks, highlights, or shadows.
3. Abstract the subject using the complexity budget below.
4. Generate each distinct asset with a separate ImageGen call. Do not use existing logos as references when testing prompt-only reproducibility.
5. Inspect the output against every rejection rule. Retry with one targeted correction when practical; never hide a failed constraint with silent post-processing.
6. Preserve the model's native square output. Report the saved path, prompt/color mapping, dimensions, opacity, and any remaining deviation.

## Complexity budget

- Build one dominant continuous outer silhouette from roughly `6–10` basic geometric shapes.
- Use at most one species-defining feature: for example, one large pouch beak, one pair of curled horns, or one broad visor.
- Use at most two internal color regions. Keep the face to two eyes and one mouth; omit eyebrows, highlights, nostrils, texture, and decorative marks unless essential.
- Prefer a head or compact upper-body crop. Do not explain the full anatomy, costume, machinery, or story.
- Remove repeated feathers, scales, fur tufts, armor plates, buttons, screws, numbers, labels, and other illustrative detail.
- Require a readable black silhouette and recognizability at `32 × 32`.

## Shape language and composition

- Use thick, rounded, weighty contours and broad color masses.
- Forbid sharp corners, pointed ears or beaks, needle-like tails, thin antennae, thin smiles, narrow gaps, and acute flame or feather tips. Replace every necessary tip with a visibly blunt rounded end.
- Show both members of paired identifying features, such as ears, horns, wings, gills, or bells.
- Let the IP emerge from the lower-left or lower-right corner and fill about `75–85%` of the canvas. Cropping at the bottom or side is intentional, but do not crop an identifying paired feature.
- Keep the artwork upright; never rotate the logo canvas or tilt the main mark without an explicit request.

## Flat-first, ultra-light neo-skeuomorphism

- Start from flat graphic shapes. Add only one diffuse internal highlight and one broad soft internal shade, with an apparent tonal variation of roughly `8–12%`.
- Keep the light direction coherent and the transitions wide and soft. Use shallow ambient/contact shading only where two large regions meet.
- Make the effect visible at full size but almost disappear at small icon size.
- Never add realistic materials, texture, specular gloss, rim light, bevels, extrusion, deep occlusion, or an external cast shadow.
- Reject pure flat fills with no tonal modeling, but also reject clay, inflatable, plastic, plush, toy-like, photorealistic, or strongly three-dimensional results.

## Color and canvas

- Use one IP color for monochrome mode, or exactly two IP colors for the default multicolor mode. Reuse those colors for facial marks; do not introduce a third highlight color.
- Add one separate solid background color. Count semantic colors, not lighter or darker shading variants: the normal maximum is two IP colors plus one background color.
- Prefer a warm off-white such as cream or parchment over pure white, and charcoal or deep navy over pure black. Use pure black or white when the user requests it or when it provides the clearest result.
- Prefer backgrounds with a clear hue and restrained saturation: terracotta, muted coral, dusty plum, sage or forest green, glaucous or denim blue, ochre, and similar softened colors. Avoid neon, electric, candy-bright, and primary-color intensity unless explicitly requested. Also avoid reducing chroma until the color reads gray, muddy, or lifeless.
- Evaluate color in OKLCH when numeric control is available; do not use HSL saturation as the primary quality test. Use these default target bands:
  - chromatic mid-tone background: `L 0.45–0.75`, `C 0.08–0.16`;
  - dark chromatic background: `L 0.18–0.35`, `C 0.05–0.14`;
  - cream or parchment background: `L 0.92–0.98`, `C 0.01–0.06`.
- Treat `C < 0.05` on a chromatic background as likely too gray and `C > 0.20` as likely too saturated. These are defaults, not overrides for a user-supplied color.
- Maintain at least `3:1` relative-luminance contrast between the dominant IP silhouette and the background, and at least `4.5:1` between small facial marks and the surface beneath them. If the requested palette misses these targets, preserve the requested background and adjust the IP colors first.
- Build a two-color IP from large continuous regions such as a face mask, hat, shell, belly, or visor. Do not scatter the second color into small decorative patches.
- Keep highlight and shade variants in the same hue family: shift OKLCH hue by no more than about `5°`, chroma by no more than `0.02`, and lightness by roughly `±0.03–0.05` around the base color. Keep total peak-to-peak lightness variation at or below `0.10`.
- Keep the background visually solid. Across unobstructed background areas, target no more than about `0.02` OKLCH lightness variation and `0.01` chroma variation; reject visible vignettes or directional gradients. Report model drift rather than silently flattening it in post-processing.
- Require a fully opaque, edge-to-edge background. Do not generate transparency, an extra white border, outer frame, card, container, rounded App-icon mask, or artificially rounded image corners.
- Generate a direct `1:1` square with square outer corners. Request approximately `1536 × 1536`; accept and preserve a native `1254 × 1254` result when that is the service output limit. Never resample merely to reach the requested number.

## Prompt skeleton

```text
Create one highly simplified IP mascot logo, not a character illustration.
Background: fully opaque edge-to-edge solid <background>; this color is background-only.
Subject: <subject> reduced to one rounded continuous silhouette and one defining feature.
Complexity: 6–10 basic shapes, at most two internal color regions, only two eyes and one mouth, readable at 32 × 32.
IP palette: exactly <one/two> colors, excluding every background-only color.
Color behavior: softened but clearly chromatic background; warm off-white and charcoal/deep navy are preferred neutrals; silhouette/background contrast >= 3:1 and facial-detail contrast >= 4.5:1; keep shading in the same hue family.
Composition: upright, emerging from the lower-left or lower-right, filling 75–85%; show both paired identifying features.
Style: Flat-first with one diffuse internal highlight and one broad internal shade, 8–12% tonal variation, visible but extremely subtle.
Forbid: illustration detail, repeated anatomy, thin lines, sharp points, third colors, pure flatness, strong 3D, clay, plastic, toy rendering, texture, gloss, bevel, external shadow, text, border, transparency, App mask, or rounded canvas corners.
```

## Reject the output when

- It reads as an illustration rather than a symbol, exceeds the complexity budget, or fails at small size.
- A background-only color appears inside the IP, the background is transparent, or the palette exceeds the selected color mode.
- A default chromatic background is neon or candy-bright, or is desaturated until it reads gray or muddy; small facial marks lack clear contrast.
- Any contour is thin, sharp, spiky, or visually fragile.
- An ear, horn, wing, gill, bell, or other paired identifier is missing or cropped.
- The IP is too small, centered like a sticker, tilted, framed, or surrounded by excessive empty space.
- The result is completely flat or noticeably volumetric instead of subtly modeled.
- The background visibly becomes a scene, texture, halo, vignette, or strong gradient rather than reading as a solid field.

When a generated result fails, state the exact failed rules. Do not claim compliance and do not silently repair it with code.
