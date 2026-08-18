# IP as Logo

`ip-as-logo` is a compact Codex skill for generating highly simplified personified mascot logos. It treats the result as a logo first and a character second: bold rounded silhouettes, strict complexity limits, oversized corner composition, and extremely subtle neo-skeuomorphic shading.

![IP as Logo showcase](assets/ip-as-logo-wall.webp)

## What it enforces

- One dominant silhouette built from roughly 6–10 basic shapes
- One- or two-color IP artwork on a separate solid background
- Thick, rounded forms without sharp or fragile details
- A 75–85% lower-corner crop with paired identifying features preserved
- Flat-first artwork with only 8–12% soft internal tonal variation
- Opaque square output without an App-icon mask, border, or transparent margin
- Explicit rejection rules for illustration-level complexity, pure flatness, and excessive 3D volume

## Install

Clone the repository, then copy its root `SKILL.md` into a skill directory inside your project's `.agents/skills` folder:

```bash
git clone https://github.com/s1dashu/ip-as-logo-skill.git
mkdir -p /path/to/project/.agents/skills/ip-as-logo
cp ip-as-logo-skill/SKILL.md /path/to/project/.agents/skills/ip-as-logo/SKILL.md
```

For a personal installation, copy `SKILL.md` into `~/.agents/skills/ip-as-logo/` instead.

## Use

Ask Codex for an IP mascot logo, for example:

```text
Create a two-color rounded ghost IP logo on a deep navy background.
```

The skill asks for a monochrome or multicolor choice when the request does not already specify one. Multicolor defaults to two IP colors plus one separate background color.

## Repository structure

```text
SKILL.md
assets/ip-as-logo-wall.webp
README.md
LICENSE
```

The skill itself intentionally consists of a single instruction document. The repository also includes the showcase image above, but no scripts, style references, or generation dependencies.

## Model behavior

Image-generation models may still introduce background gradients, crop paired features, or add too much volume. The skill treats those as failures to report or retry, rather than silently claiming compliance or repairing the image after generation.

## License

MIT
