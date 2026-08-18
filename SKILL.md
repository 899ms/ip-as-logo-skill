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
- Add one separate solid background color. Prefer black, white, or a harmonious moderately saturated solid when the user does not specify one.
- Require a fully opaque, edge-to-edge background. Do not generate transparency, an extra white border, outer frame, card, container, rounded App-icon mask, or artificially rounded image corners.
- Generate a direct `1:1` square with square outer corners. Request approximately `1536 × 1536`; accept and preserve a native `1254 × 1254` result when that is the service output limit. Never resample merely to reach the requested number.

## Prompt skeleton

```text
Create one highly simplified IP mascot logo, not a character illustration.
Background: fully opaque edge-to-edge solid <background>; this color is background-only.
Subject: <subject> reduced to one rounded continuous silhouette and one defining feature.
Complexity: 6–10 basic shapes, at most two internal color regions, only two eyes and one mouth, readable at 32 × 32.
IP palette: exactly <one/two> colors, excluding every background-only color.
Composition: upright, emerging from the lower-left or lower-right, filling 75–85%; show both paired identifying features.
Style: Flat-first with one diffuse internal highlight and one broad internal shade, 8–12% tonal variation, visible but extremely subtle.
Forbid: illustration detail, repeated anatomy, thin lines, sharp points, third colors, pure flatness, strong 3D, clay, plastic, toy rendering, texture, gloss, bevel, external shadow, text, border, transparency, App mask, or rounded canvas corners.
```

## Reject the output when

- It reads as an illustration rather than a symbol, exceeds the complexity budget, or fails at small size.
- A background-only color appears inside the IP, the background is transparent, or the palette exceeds the selected color mode.
- Any contour is thin, sharp, spiky, or visually fragile.
- An ear, horn, wing, gill, bell, or other paired identifier is missing or cropped.
- The IP is too small, centered like a sticker, tilted, framed, or surrounded by excessive empty space.
- The result is completely flat or noticeably volumetric instead of subtly modeled.
- The background visibly becomes a scene, texture, halo, vignette, or strong gradient rather than reading as a solid field.

When a generated result fails, state the exact failed rules. Do not claim compliance and do not silently repair it with code.
