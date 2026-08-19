import { type SVGProps, useCallback, useEffect, useRef, useState } from "react"
import { IconDownloadOutline18 as DownloadIcon } from "nucleo-ui-outline-18/components/IconDownloadOutline18"
import { IconImageOutline18 as ImageIcon } from "nucleo-ui-outline-18/components/IconImageOutline18"
import { IconLanguageOutline18 as LanguagesIcon } from "nucleo-ui-outline-18/components/IconLanguageOutline18"
import { IconMagnifierOutline18 as SearchIcon } from "nucleo-ui-outline-18/components/IconMagnifierOutline18"
import { IconShuffleOutline18 as ShuffleIcon } from "nucleo-ui-outline-18/components/IconShuffleOutline18"
import { IconXmarkOutline18 as XIcon } from "nucleo-ui-outline-18/components/IconXmarkOutline18"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import logoMetadata from "@/generated/logo-metadata.json"
import {
  detectLocale,
  isLocale,
  localeOptions,
  localeTags,
  translations,
  type Category,
  type Copy,
  type Locale,
} from "@/i18n"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

type Logo = {
  id: number
  slug: string
  name: string
  category: Category
  storage_key: string
  image_url: string
  byte_size: number
  created_at: string
}

const initialBatchSize = 80
const nextBatchSize = 40
const githubUrl = "https://github.com/s1dashu/ip-as-logo-skill"

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .7A11.3 11.3 0 0 0 8.43 22.73c.57.1.78-.25.78-.55v-2.16c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.52-2.54-.29-5.21-1.27-5.21-5.59 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .96-.3 3.12 1.16a10.83 10.83 0 0 1 5.68 0c2.16-1.46 3.11-1.16 3.11-1.16.63 1.56.23 2.71.12 3 .73.79 1.17 1.8 1.17 3.04 0 4.33-2.68 5.29-5.23 5.57.41.35.78 1.05.78 2.12v3.17c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  )
}

function newSeed() {
  return crypto.randomUUID()
}

function variantUrl(storageKey: string, size: "thumb" | "display") {
  const fileName = storageKey.split("/").at(-1)
  if (!fileName?.endsWith(".png")) {
    throw new Error(`Unexpected logo storage key: ${storageKey}`)
  }

  const directory = size === "display" ? "display-512" : "thumb"
  return `/logos/${directory}/${fileName.replace(/\.png$/, ".webp")}`
}

function LogoCard({
  logo,
  onError,
  priority,
  copy,
}: {
  logo: Logo
  onError: (message: string) => void
  priority: boolean
  copy: Copy
}) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDisplayLoaded, setIsDisplayLoaded] = useState(false)
  const thumbUrl = variantUrl(logo.storage_key, "thumb")
  const displayUrl = variantUrl(logo.storage_key, "display")
  const metadata = (
    logoMetadata as Record<
      string,
      { backgroundColor: string; width: number; height: number }
    >
  )[logo.storage_key]
  if (!metadata) {
    throw new Error(`Missing generated metadata for ${logo.storage_key}`)
  }

  function handleImageError(url: string, stage: "placeholder" | "display") {
    console.error("Logo image failed to load", {
      logoId: logo.id,
      storageKey: logo.storage_key,
      stage,
      url,
    })
    onError(copy.imageError(logo.name))
  }

  async function downloadLogo() {
    setIsDownloading(true)
    try {
      const response = await fetch(logo.image_url)
      if (!response.ok) throw new Error(`R2 returned ${response.status}`)

      const objectUrl = URL.createObjectURL(await response.blob())
      const anchor = document.createElement("a")
      anchor.href = objectUrl
      anchor.download = `${logo.slug}.png`
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error("Logo download failed", {
        logoId: logo.id,
        imageUrl: logo.image_url,
        error,
      })
      onError(copy.downloadError(logo.name))
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <article
      className="group relative aspect-square overflow-hidden rounded-xl"
      style={{ backgroundColor: metadata.backgroundColor }}
    >
      <img
        className="absolute inset-0 size-full scale-110 object-cover blur-lg"
        src={thumbUrl}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => handleImageError(thumbUrl, "placeholder")}
      />
      <img
        className={cn(
          "absolute inset-0 size-full scale-[1.015] object-cover transition-opacity duration-300",
          isDisplayLoaded ? "opacity-100" : "opacity-0"
        )}
        src={displayUrl}
        alt={copy.imageAlt(logo.name)}
        width={512}
        height={512}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setIsDisplayLoaded(true)}
        onError={() => handleImageError(displayUrl, "display")}
      />

      <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-2 bg-gradient-to-t from-background/95 via-background/75 to-transparent px-3 pt-8 pb-3 opacity-0 transition-all duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{logo.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {metadata.width} × {metadata.height} px
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label={copy.downloadAria(logo.name)}
                disabled={isDownloading}
                onClick={downloadLogo}
                size="icon"
              />
            }
          >
            {isDownloading ? <Spinner /> : <DownloadIcon />}
          </TooltipTrigger>
          <TooltipContent>{copy.downloadTooltip}</TooltipContent>
        </Tooltip>
      </div>
    </article>
  )
}

function LoadingGrid({ count = 16 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <Skeleton className="aspect-square rounded-xl" key={index} />
  ))
}

export function App() {
  const [locale, setLocale] = useState<Locale>(detectLocale)
  const [logos, setLogos] = useState<Logo[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [seed, setSeed] = useState(newSeed)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const logosLengthRef = useRef(0)
  const hasLeftTopRef = useRef(false)
  const requestGenerationRef = useRef(0)
  const copy = translations[locale]

  useEffect(() => {
    localStorage.setItem("ips-logo-language", locale)
    document.documentElement.lang = localeTags[locale]
  }, [locale])

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    logosLengthRef.current = logos.length
  }, [logos.length])

  const fetchLogos = useCallback(
    async (reset: boolean) => {
      const requestGeneration = reset
        ? requestGenerationRef.current + 1
        : requestGenerationRef.current
      if (reset) requestGenerationRef.current = requestGeneration

      const offset = reset ? 0 : logosLengthRef.current
      const limit = reset ? initialBatchSize : nextBatchSize
      if (reset) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)

      try {
        const [logosResult, countResult] = await Promise.all([
          supabase.rpc("get_logos", {
            p_seed: seed,
            p_offset: offset,
            p_limit: limit,
            p_search: search,
            p_category: "all",
            p_sort: "random",
          }),
          reset
            ? supabase.rpc("get_logo_count", {
                p_search: search,
                p_category: "all",
              })
            : Promise.resolve({ data: null, error: null }),
        ])

        if (logosResult.error) throw logosResult.error
        if (countResult.error) throw countResult.error
        if (requestGeneration !== requestGenerationRef.current) return

        const nextLogos = (logosResult.data ?? []) as Logo[]
        setLogos((current) => (reset ? nextLogos : [...current, ...nextLogos]))
        if (reset) {
          const nextTotal = Number(countResult.data ?? 0)
          setTotal(nextTotal)
        }
      } catch (caughtError) {
        console.error("Logo query failed", {
          reset,
          offset,
          search,
          seed,
          caughtError,
        })
        if (requestGeneration === requestGenerationRef.current) {
          setError(copy.queryError)
        }
      } finally {
        if (requestGeneration === requestGenerationRef.current) {
          if (reset) setIsLoading(false)
          else setIsLoadingMore(false)
        }
      }
    },
    [copy.queryError, search, seed]
  )

  useEffect(() => {
    const task = window.setTimeout(() => void fetchLogos(true), 0)
    return () => window.clearTimeout(task)
  }, [fetchLogos])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoading &&
          !isLoadingMore &&
          logosLengthRef.current < total
        ) {
          void fetchLogos(false)
        }
      },
      { rootMargin: "1200px 0px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchLogos, isLoading, isLoadingMore, total])

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 480) hasLeftTopRef.current = true
      if (window.scrollY <= 4 && hasLeftTopRef.current && !isLoading) {
        hasLeftTopRef.current = false
        setSeed(newSeed())
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoading])

  function changeLocale(value: string | null) {
    if (!isLocale(value)) throw new Error(`Unsupported locale: ${value}`)
    setError(null)
    setLocale(value)
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              className="size-8 rounded-lg object-cover"
              src="https://pub-ea227675401244aea7769a0ec376738f.r2.dev/brand/ips-logo-skill.png"
              alt="IP as Logo Skill"
            />
            <span className="font-heading font-medium">IP as Logo Skill</span>
          </div>

          <div className="flex items-center gap-1">
            <Select value={locale} onValueChange={changeLocale}>
              <SelectTrigger
                aria-label={copy.languageLabel}
                className="cursor-pointer"
              >
                <LanguagesIcon />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {localeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    render={
                      <a href={githubUrl} target="_blank" rel="noreferrer" />
                    }
                    aria-label={copy.githubAria}
                    size="icon"
                    variant="ghost"
                  />
                }
              >
                <GithubIcon />
              </TooltipTrigger>
              <TooltipContent>{copy.githubTooltip}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6">
        <section
          aria-label={copy.bannerLabel}
          className="flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium">{copy.bannerTitle}</p>
            <p className="text-sm text-muted-foreground">
              {copy.bannerDescription}
            </p>
          </div>
          <Button
            render={<a href={githubUrl} target="_blank" rel="noreferrer" />}
            size="lg"
          >
            <GithubIcon data-icon="inline-start" /> {copy.viewGithub}
          </Button>
        </section>

        <section
          aria-label={copy.controlsLabel}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium">
              {copy.logoCount(total.toLocaleString(localeTags[locale]))}
            </p>
            <p className="text-sm text-muted-foreground">{copy.commercial}</p>
          </div>

          <div className="flex w-full min-w-0 gap-2 sm:w-auto sm:min-w-96">
            <div className="min-w-0 flex-1 sm:w-72">
              <InputGroup className="h-9">
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  aria-label={copy.searchAria}
                  placeholder={copy.searchPlaceholder}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
                {searchInput ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label={copy.clearSearch}
                      onClick={() => setSearchInput("")}
                      size="icon-xs"
                    >
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
            </div>
            <Button onClick={() => setSeed(newSeed())} size="lg">
              <ShuffleIcon data-icon="inline-start" /> {copy.shuffle}
            </Button>
          </div>
        </section>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{copy.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <section
          aria-label={copy.libraryLabel}
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {isLoading ? <LoadingGrid count={80} /> : null}
          {!isLoading
            ? logos.map((logo, index) => (
                <LogoCard
                  key={logo.id}
                  logo={logo}
                  onError={setError}
                  priority={index < 12}
                  copy={copy}
                />
              ))
            : null}
        </section>

        {!isLoading && logos.length === 0 && !error ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>{copy.noLogos}</EmptyTitle>
              <EmptyDescription>{copy.noLogosDescription}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={() => setSearchInput("")}>
                {copy.clearSearch}
              </Button>
            </EmptyContent>
          </Empty>
        ) : null}

        <div
          ref={sentinelRef}
          className="flex min-h-14 items-center justify-center"
          aria-live="polite"
        >
          {isLoadingMore ? (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> {copy.loadingMore}
            </span>
          ) : null}
          {!isLoading && logos.length > 0 && logos.length >= total ? (
            <span className="text-sm text-muted-foreground">
              {copy.seenAll}
            </span>
          ) : null}
        </div>
      </main>
    </TooltipProvider>
  )
}

export default App
