# IP as Logo

`ip-as-logo` is a compact Codex skill for generating highly simplified personified mascot logos. It treats the result as a logo first and a character second: bold rounded silhouettes, strict complexity limits, oversized corner composition, and extremely subtle neo-skeuomorphic shading.

## What it enforces

- One dominant silhouette built from roughly 6–10 basic shapes
- One- or two-color IP artwork on a separate solid background
- Thick, rounded forms without sharp or fragile details
- A 75–85% lower-corner crop with paired identifying features preserved
- Flat-first artwork with only 8–12% soft internal tonal variation
- Opaque square output without an App-icon mask, border, or transparent margin
- Explicit rejection rules for illustration-level complexity, pure flatness, and excessive 3D volume

## Install

Clone the repository and copy the skill into a project's `.agents/skills` directory:

```bash
git clone https://github.com/s1dashu/ip-as-logo-skill.git
mkdir -p /path/to/project/.agents/skills
cp -R ip-as-logo-skill/.agents/skills/ip-as-logo /path/to/project/.agents/skills/
```

For a personal installation, copy the same folder into `~/.codex/skills/` instead.

## Use

Ask Codex for an IP mascot logo, for example:

```text
Create a two-color rounded ghost IP logo on a deep navy background.
```

The skill asks for a monochrome or multicolor choice when the request does not already specify one. Multicolor defaults to two IP colors plus one separate background color.

## Repository structure

```text
.agents/skills/ip-as-logo/SKILL.md
```

The skill intentionally consists of a single instruction document. It has no scripts, bundled reference images, or style-reference dependencies.

## Model behavior

Image-generation models may still introduce background gradients, crop paired features, or add too much volume. The skill treats those as failures to report or retry, rather than silently claiming compliance or repairing the image after generation.

## License

MIT
