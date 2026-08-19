import { createHash } from "node:crypto"
import { readdir, readFile, stat, mkdir, writeFile } from "node:fs/promises"
import { basename, extname, relative, resolve } from "node:path"

const websiteRoot = resolve(import.meta.dirname, "..")
const repositoryRoot = resolve(websiteRoot, "..")
const outputRoots = [resolve(repositoryRoot, "output"), resolve(repositoryRoot, "outputs")]
const publicBaseUrl = process.env.R2_PUBLIC_URL
const manifestPath = resolve(websiteRoot, "data/logos.json")

if (!publicBaseUrl) throw new Error("R2_PUBLIC_URL is required to build the logo manifest")

const excludedPathPattern = /(?:contact[-_ ]?sheet|preview|rejected[-_ ]?draft|\/drafts?\/|showcase)/i
const animalWords = new Set(["alpaca", "armadillo", "axolotl", "badger", "bat", "bear", "beaver", "bee", "beetle", "bird", "bison", "boar", "butterfly", "camel", "capybara", "cat", "chameleon", "cheetah", "chicken", "crab", "crocodile", "deer", "dog", "dolphin", "donkey", "duck", "eagle", "elephant", "firefly", "flamingo", "fox", "frog", "giraffe", "goat", "goose", "hamster", "hedgehog", "hippo", "horse", "ibex", "jellyfish", "kangaroo", "kiwi", "koi", "ladybug", "lemur", "lion", "lobster", "manatee", "manta", "meerkat", "mole", "monkey", "moose", "narwhal", "nautilus", "octopus", "orca", "otter", "owl", "panda", "pangolin", "parrot", "pelican", "penguin", "pig", "puffin", "rabbit", "raccoon", "ram", "rhino", "salamander", "seal", "seahorse", "shark", "shiba", "sloth", "snail", "snow", "squid", "sugar", "swan", "tapir", "tiger", "tortoise", "turtle", "walrus", "whale", "wolf", "wombat", "yak", "zebra"])
const natureWords = new Set(["artichoke", "bamboo", "bonsai", "cactus", "cloud", "coconut", "comet", "coral", "flower", "ginkgo", "leaf", "moon", "mushroom", "pear", "pinecone", "pumpkin", "rainbow", "snowflake", "star", "strawberry", "sun", "sunflower", "tree", "tulip", "watermelon"])
const foodWords = new Set(["bell-pepper", "bread", "cake", "coffee", "croissant", "cupcake", "donut", "ice-cream", "peanut", "popcorn", "sushi", "taco", "teapot"])
const symbolWords = new Set(["atom", "bell", "diamond", "ghost", "heart", "map-pin", "music-note", "portal", "puzzle", "shield", "speech-bubble"])
const objectWords = new Set(["airplane", "backpack", "bicycle", "binoculars", "book", "camera", "controller", "envelope", "flask", "hammer", "headphones", "helicopter", "hourglass", "key", "lightbulb", "microphone", "paintbrush", "pencil", "robot", "rocket", "sailboat", "scissors", "scooter", "skateboard", "skate", "tractor", "train", "umbrella", "wrench"])

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const paths = []
  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name)
    if (entry.isDirectory()) paths.push(...(await walk(absolutePath)))
    else paths.push(absolutePath)
  }
  return paths
}

function subjectFromFile(filePath) {
  const stem = basename(filePath, extname(filePath)).toLowerCase()
  const normalizedStem = filePath.includes("/curated-project-logos-")
    ? stem
        .replace(/^[a-j]-/, "")
        .replace(/^(?:new-|finalskill-|palette\d+-|redo\d+-|two-color-)/, "")
        .replace(/-(?:two|three)-color$/, "")
    : stem

  return normalizedStem
    .replace(/^(?:candidate[-_])?\d{1,3}[-_]/, "")
    .replace(/^[a-z]\d{2}[-_]/, "")
    .replace(/[-_](?:duo|mono|final|retry|selected|v\d+)$/, "")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function categoryFor(subject) {
  const tokens = new Set([subject, ...subject.split("-")])
  if ([...tokens].some((token) => animalWords.has(token))) return "animals"
  if ([...tokens].some((token) => natureWords.has(token))) return "nature"
  if ([...tokens].some((token) => foodWords.has(token))) return "food"
  if ([...tokens].some((token) => symbolWords.has(token))) return "symbols"
  if ([...tokens].some((token) => objectWords.has(token))) return "objects"
  return "other"
}

function titleCase(subject) {
  return subject.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

const allFiles = (await Promise.all(outputRoots.map(walk))).flat()
  .filter((filePath) => extname(filePath).toLowerCase() === ".png")
  .filter((filePath) => !excludedPathPattern.test(filePath))
  .sort()

let previousLogos = []
try {
  previousLogos = JSON.parse(await readFile(manifestPath, "utf8"))
} catch (error) {
  if (error?.code !== "ENOENT") throw error
}

const existingByHash = new Map(previousLogos.map((logo) => [logo.content_hash, logo]))
const reservedSlugs = new Set(previousLogos.map((logo) => logo.slug))
const seenHashes = new Set()
const logos = []

for (const absolutePath of allFiles) {
  const bytes = await readFile(absolutePath)
  const contentHash = createHash("sha256").update(bytes).digest("hex")
  if (seenHashes.has(contentHash)) continue
  seenHashes.add(contentHash)

  const sourcePath = relative(repositoryRoot, absolutePath)
  const fileStats = await stat(absolutePath)
  const existing = existingByHash.get(contentHash)
  if (existing) {
    logos.push({
      ...existing,
      image_url: `${publicBaseUrl.replace(/\/$/, "")}/${existing.storage_key}`,
      source_path: sourcePath,
      byte_size: fileStats.size,
    })
    continue
  }

  const subject = subjectFromFile(absolutePath) || "untitled-logo"
  let slug = subject
  let suffix = 2
  while (reservedSlugs.has(slug)) {
    slug = `${subject}-${suffix}`
    suffix += 1
  }
  reservedSlugs.add(slug)
  const storageKey = `logos/${contentHash.slice(0, 16)}-${slug}.png`

  logos.push({
    slug,
    name: titleCase(subject),
    category: categoryFor(subject),
    storage_key: storageKey,
    image_url: `${publicBaseUrl.replace(/\/$/, "")}/${storageKey}`,
    source_path: sourcePath,
    content_hash: contentHash,
    byte_size: fileStats.size,
  })
}

const dataDirectory = resolve(websiteRoot, "data")
await mkdir(dataDirectory, { recursive: true })
await writeFile(manifestPath, `${JSON.stringify(logos, null, 2)}\n`)
await writeFile(resolve(dataDirectory, "upload-list.json"), `${JSON.stringify(logos.map(({ source_path, storage_key }) => ({ source_path, storage_key })), null, 2)}\n`)

const categoryCounts = Object.fromEntries(Object.entries(Object.groupBy(logos, (logo) => logo.category)).map(([category, items]) => [category, items.length]))
console.log(JSON.stringify({ candidates: allFiles.length, unique: logos.length, categories: categoryCounts }, null, 2))
