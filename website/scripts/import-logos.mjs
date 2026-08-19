import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")

const logos = JSON.parse(await readFile(resolve(import.meta.dirname, "../data/logos.json"), "utf8"))
const batchSize = 100

for (let index = 0; index < logos.length; index += batchSize) {
  const batch = logos.slice(index, index + batchSize)
  const response = await fetch(`${supabaseUrl}/rest/v1/logos?on_conflict=content_hash`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(batch),
  })
  if (!response.ok) throw new Error(`Logo import failed for batch ${index / batchSize + 1}: ${response.status} ${await response.text()}`)
  console.log(`Imported ${Math.min(index + batch.length, logos.length)}/${logos.length}`)
}
