import { inflateSync } from "node:zlib"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { spawn } from "node:child_process"
import { basename, resolve } from "node:path"

const websiteRoot = resolve(import.meta.dirname, "..")
const repositoryRoot = resolve(websiteRoot, "..")
const logos = JSON.parse(
  await readFile(resolve(websiteRoot, "data/logos.json"), "utf8")
)
const variants = [
  { directory: "thumb", size: 24, quality: 35 },
  { directory: "display-512", size: 512, quality: 84 },
]
const concurrency = Math.max(
  2,
  Math.min(8, Number.parseInt(process.env.IMAGE_VARIANT_CONCURRENCY ?? "6", 10))
)

if (!Number.isFinite(concurrency)) {
  throw new Error(
    `Invalid IMAGE_VARIANT_CONCURRENCY: ${process.env.IMAGE_VARIANT_CONCURRENCY}`
  )
}

async function run(command, args, context) {
  await new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] })
    let stderr = ""
    child.stderr.on("data", (chunk) => {
      stderr += chunk
    })
    child.on("error", (error) =>
      reject(new Error(`${context}: ${error.message}`, { cause: error }))
    )
    child.on("close", (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${context}: cwebp exited with ${code}\n${stderr}`))
    })
  })
}

function readPngMetadata(pngBytes, context) {
  const signature = pngBytes.subarray(0, 8).toString("hex")
  if (signature !== "89504e470d0a1a0a")
    throw new Error(`${context}: invalid PNG signature`)

  let offset = 8
  let width
  let height
  let bitDepth
  let colorType
  const idatChunks = []
  while (offset < pngBytes.length) {
    const length = pngBytes.readUInt32BE(offset)
    const type = pngBytes.subarray(offset + 4, offset + 8).toString("ascii")
    const data = pngBytes.subarray(offset + 8, offset + 8 + length)
    if (type === "IHDR") {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === "IDAT") {
      idatChunks.push(data)
    } else if (type === "IEND") {
      break
    }
    offset += length + 12
  }

  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : null
  if (
    !width ||
    !height ||
    bitDepth !== 8 ||
    !channels ||
    idatChunks.length === 0
  ) {
    throw new Error(
      `${context}: expected a non-interlaced 8-bit RGB or RGBA PNG`
    )
  }

  const inflated = inflateSync(Buffer.concat(idatChunks))
  const filter = inflated[0]
  const firstPixel = [...inflated.subarray(1, 1 + channels)]
  if (filter === 1 || filter === 3 || filter === 4) {
    // The first pixel has no left neighbour, so these filters preserve its bytes.
  } else if (filter !== 0 && filter !== 2) {
    throw new Error(`${context}: unsupported first-row PNG filter ${filter}`)
  }

  const [red, green, blue, alpha = 255] = firstPixel
  const composite = (channel) =>
    Math.round((channel * alpha + 255 * (255 - alpha)) / 255)
  const backgroundColor = `#${[composite(red), composite(green), composite(blue)].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
  return { backgroundColor, width, height }
}

async function createVariants(logo) {
  const sourcePath = resolve(repositoryRoot, logo.source_path)
  const fileName = basename(logo.storage_key).replace(/\.png$/, ".webp")
  const pngBytes = await readFile(sourcePath)

  for (const variant of variants) {
    const outputPath = resolve(
      websiteRoot,
      "public/logos",
      variant.directory,
      fileName
    )
    await run(
      "cwebp",
      [
        "-quiet",
        "-mt",
        "-resize",
        String(variant.size),
        String(variant.size),
        "-q",
        String(variant.quality),
        sourcePath,
        "-o",
        outputPath,
      ],
      `${logo.storage_key} (${variant.directory})`
    )
  }

  return readPngMetadata(pngBytes, logo.storage_key)
}

for (const variant of variants) {
  await mkdir(resolve(websiteRoot, "public/logos", variant.directory), {
    recursive: true,
  })
}

let nextIndex = 0
let completed = 0
const logoMetadata = new Map()
async function worker() {
  while (nextIndex < logos.length) {
    const logo = logos[nextIndex]
    nextIndex += 1
    logoMetadata.set(logo.storage_key, await createVariants(logo))
    completed += 1
    if (completed % 50 === 0 || completed === logos.length) {
      console.log(`Generated variants for ${completed}/${logos.length} logos`)
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()))

const generatedDirectory = resolve(websiteRoot, "src/generated")
await mkdir(generatedDirectory, { recursive: true })
await writeFile(
  resolve(generatedDirectory, "logo-metadata.json"),
  `${JSON.stringify(Object.fromEntries(logos.map((logo) => [logo.storage_key, logoMetadata.get(logo.storage_key)])), null, 2)}\n`
)
