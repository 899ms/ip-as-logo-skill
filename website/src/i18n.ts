export const localeOptions = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
] as const

export type Locale = (typeof localeOptions)[number]["value"]
export type Category =
  "animals" | "nature" | "food" | "objects" | "symbols" | "other"

export type Copy = {
  languageLabel: string
  githubAria: string
  githubTooltip: string
  bannerLabel: string
  bannerTitle: string
  bannerDescription: string
  viewGithub: string
  controlsLabel: string
  logoCount: (count: string) => string
  commercial: string
  searchAria: string
  searchPlaceholder: string
  clearSearch: string
  shuffle: string
  errorTitle: string
  queryError: string
  imageError: (name: string) => string
  downloadError: (name: string) => string
  imageAlt: (name: string) => string
  downloadAria: (name: string) => string
  downloadTooltip: string
  libraryLabel: string
  noLogos: string
  noLogosDescription: string
  loadingMore: string
  seenAll: string
  categories: Record<Category, string>
}

export const localeTags: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  fr: "fr-FR",
  es: "es-ES",
}

export const translations: Record<Locale, Copy> = {
  en: {
    languageLabel: "Language",
    githubAria: "View IP as Logo Skill on GitHub",
    githubTooltip: "View project on GitHub",
    bannerLabel: "IP as Logo Skill on GitHub",
    bannerTitle: "Create original mascot logos with IP as Logo Skill",
    bannerDescription:
      "Explore the open-source project, install the skill, and make your own collection.",
    viewGithub: "View on GitHub",
    controlsLabel: "Logo controls",
    logoCount: (count) => `${count} free logos`,
    commercial: "Free to download and use commercially.",
    searchAria: "Search logos",
    searchPlaceholder: "Search logos…",
    clearSearch: "Clear search",
    shuffle: "Shuffle",
    errorTitle: "Something went wrong",
    queryError: "The logo library could not be loaded. Please try again.",
    imageError: (name) =>
      `Could not load ${name}. Please refresh and try again.`,
    downloadError: (name) => `Could not download ${name}. Please try again.`,
    imageAlt: (name) => `${name} mascot logo`,
    downloadAria: (name) => `Download original ${name}`,
    downloadTooltip: "Download original PNG",
    libraryLabel: "Logo library",
    noLogos: "No logos found",
    noLogosDescription: "Try another search.",
    loadingMore: "Loading another batch…",
    seenAll: "You’ve seen every matching logo.",
    categories: {
      animals: "animals",
      nature: "nature",
      food: "food",
      objects: "objects",
      symbols: "symbols",
      other: "other",
    },
  },
  zh: {
    languageLabel: "语言",
    githubAria: "在 GitHub 上查看 IP as Logo Skill",
    githubTooltip: "在 GitHub 上查看项目",
    bannerLabel: "GitHub 上的 IP as Logo Skill",
    bannerTitle: "使用 IP as Logo Skill 创作原创吉祥物 Logo",
    bannerDescription: "探索开源项目、安装 Skill，并创建你自己的 Logo 合集。",
    viewGithub: "前往 GitHub",
    controlsLabel: "Logo 控制栏",
    logoCount: (count) => `${count} 个免费 Logo`,
    commercial: "可免费下载并免费商用。",
    searchAria: "搜索 Logo",
    searchPlaceholder: "搜索 Logo…",
    clearSearch: "清除搜索",
    shuffle: "随机换一批",
    errorTitle: "出现错误",
    queryError: "无法加载 Logo 库，请重试。",
    imageError: (name) => `无法加载 ${name}，请刷新后重试。`,
    downloadError: (name) => `无法下载 ${name}，请重试。`,
    imageAlt: (name) => `${name} 吉祥物 Logo`,
    downloadAria: (name) => `下载 ${name} 原图`,
    downloadTooltip: "下载原始 PNG",
    libraryLabel: "Logo 库",
    noLogos: "没有找到 Logo",
    noLogosDescription: "请尝试其他搜索词。",
    loadingMore: "正在加载更多…",
    seenAll: "已经看完所有匹配的 Logo。",
    categories: {
      animals: "动物",
      nature: "自然",
      food: "食物",
      objects: "物品",
      symbols: "符号",
      other: "其他",
    },
  },
  ja: {
    languageLabel: "言語",
    githubAria: "GitHub で IP as Logo Skill を見る",
    githubTooltip: "GitHub でプロジェクトを見る",
    bannerLabel: "GitHub の IP as Logo Skill",
    bannerTitle: "IP as Logo Skill でオリジナルのマスコットロゴを作成",
    bannerDescription:
      "オープンソースプロジェクトを確認し、Skill をインストールして独自のコレクションを作りましょう。",
    viewGithub: "GitHub で見る",
    controlsLabel: "ロゴ操作",
    logoCount: (count) => `${count}点の無料ロゴ`,
    commercial: "無料でダウンロードでき、商用利用も可能です。",
    searchAria: "ロゴを検索",
    searchPlaceholder: "ロゴを検索…",
    clearSearch: "検索をクリア",
    shuffle: "シャッフル",
    errorTitle: "エラーが発生しました",
    queryError:
      "ロゴライブラリを読み込めませんでした。もう一度お試しください。",
    imageError: (name) =>
      `${name} を読み込めませんでした。再読み込みしてください。`,
    downloadError: (name) =>
      `${name} をダウンロードできませんでした。もう一度お試しください。`,
    imageAlt: (name) => `${name} のマスコットロゴ`,
    downloadAria: (name) => `${name} のオリジナル画像をダウンロード`,
    downloadTooltip: "オリジナル PNG をダウンロード",
    libraryLabel: "ロゴライブラリ",
    noLogos: "ロゴが見つかりません",
    noLogosDescription: "別のキーワードで検索してください。",
    loadingMore: "さらに読み込み中…",
    seenAll: "一致するロゴをすべて表示しました。",
    categories: {
      animals: "動物",
      nature: "自然",
      food: "食べ物",
      objects: "物",
      symbols: "シンボル",
      other: "その他",
    },
  },
  ko: {
    languageLabel: "언어",
    githubAria: "GitHub에서 IP as Logo Skill 보기",
    githubTooltip: "GitHub에서 프로젝트 보기",
    bannerLabel: "GitHub의 IP as Logo Skill",
    bannerTitle: "IP as Logo Skill로 오리지널 마스코트 로고 만들기",
    bannerDescription:
      "오픈 소스 프로젝트를 살펴보고 Skill을 설치해 나만의 컬렉션을 만들어 보세요.",
    viewGithub: "GitHub에서 보기",
    controlsLabel: "로고 컨트롤",
    logoCount: (count) => `무료 로고 ${count}개`,
    commercial: "무료 다운로드 및 상업적 이용이 가능합니다.",
    searchAria: "로고 검색",
    searchPlaceholder: "로고 검색…",
    clearSearch: "검색 지우기",
    shuffle: "무작위 섞기",
    errorTitle: "문제가 발생했습니다",
    queryError: "로고 라이브러리를 불러오지 못했습니다. 다시 시도해 주세요.",
    imageError: (name) =>
      `${name}을(를) 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.`,
    downloadError: (name) =>
      `${name}을(를) 다운로드하지 못했습니다. 다시 시도해 주세요.`,
    imageAlt: (name) => `${name} 마스코트 로고`,
    downloadAria: (name) => `${name} 원본 다운로드`,
    downloadTooltip: "원본 PNG 다운로드",
    libraryLabel: "로고 라이브러리",
    noLogos: "로고를 찾을 수 없습니다",
    noLogosDescription: "다른 검색어를 사용해 보세요.",
    loadingMore: "더 불러오는 중…",
    seenAll: "일치하는 모든 로고를 확인했습니다.",
    categories: {
      animals: "동물",
      nature: "자연",
      food: "음식",
      objects: "사물",
      symbols: "기호",
      other: "기타",
    },
  },
  fr: {
    languageLabel: "Langue",
    githubAria: "Voir IP as Logo Skill sur GitHub",
    githubTooltip: "Voir le projet sur GitHub",
    bannerLabel: "IP as Logo Skill sur GitHub",
    bannerTitle: "Créez des logos mascottes originaux avec IP as Logo Skill",
    bannerDescription:
      "Découvrez le projet open source, installez le Skill et créez votre propre collection.",
    viewGithub: "Voir sur GitHub",
    controlsLabel: "Commandes des logos",
    logoCount: (count) => `${count} logos gratuits`,
    commercial: "Téléchargement et utilisation commerciale gratuits.",
    searchAria: "Rechercher des logos",
    searchPlaceholder: "Rechercher des logos…",
    clearSearch: "Effacer la recherche",
    shuffle: "Mélanger",
    errorTitle: "Une erreur est survenue",
    queryError:
      "Impossible de charger la bibliothèque de logos. Veuillez réessayer.",
    imageError: (name) =>
      `Impossible de charger ${name}. Actualisez la page et réessayez.`,
    downloadError: (name) =>
      `Impossible de télécharger ${name}. Veuillez réessayer.`,
    imageAlt: (name) => `Logo mascotte ${name}`,
    downloadAria: (name) => `Télécharger l’original de ${name}`,
    downloadTooltip: "Télécharger le PNG original",
    libraryLabel: "Bibliothèque de logos",
    noLogos: "Aucun logo trouvé",
    noLogosDescription: "Essayez une autre recherche.",
    loadingMore: "Chargement d’un nouveau lot…",
    seenAll: "Vous avez vu tous les logos correspondants.",
    categories: {
      animals: "animaux",
      nature: "nature",
      food: "alimentation",
      objects: "objets",
      symbols: "symboles",
      other: "autres",
    },
  },
  es: {
    languageLabel: "Idioma",
    githubAria: "Ver IP as Logo Skill en GitHub",
    githubTooltip: "Ver el proyecto en GitHub",
    bannerLabel: "IP as Logo Skill en GitHub",
    bannerTitle: "Crea logos de mascota originales con IP as Logo Skill",
    bannerDescription:
      "Explora el proyecto de código abierto, instala el Skill y crea tu propia colección.",
    viewGithub: "Ver en GitHub",
    controlsLabel: "Controles de logos",
    logoCount: (count) => `${count} logos gratis`,
    commercial: "Descarga y uso comercial gratuitos.",
    searchAria: "Buscar logos",
    searchPlaceholder: "Buscar logos…",
    clearSearch: "Borrar búsqueda",
    shuffle: "Mezclar",
    errorTitle: "Algo salió mal",
    queryError: "No se pudo cargar la biblioteca de logos. Inténtalo de nuevo.",
    imageError: (name) =>
      `No se pudo cargar ${name}. Actualiza la página e inténtalo de nuevo.`,
    downloadError: (name) =>
      `No se pudo descargar ${name}. Inténtalo de nuevo.`,
    imageAlt: (name) => `Logo de mascota ${name}`,
    downloadAria: (name) => `Descargar el original de ${name}`,
    downloadTooltip: "Descargar PNG original",
    libraryLabel: "Biblioteca de logos",
    noLogos: "No se encontraron logos",
    noLogosDescription: "Prueba otra búsqueda.",
    loadingMore: "Cargando otro lote…",
    seenAll: "Has visto todos los logos coincidentes.",
    categories: {
      animals: "animales",
      nature: "naturaleza",
      food: "comida",
      objects: "objetos",
      symbols: "símbolos",
      other: "otros",
    },
  },
}

export function isLocale(value: string | null): value is Locale {
  return localeOptions.some((option) => option.value === value)
}

export function detectLocale(): Locale {
  const storedLocale = localStorage.getItem("ips-logo-language")
  if (isLocale(storedLocale)) return storedLocale

  const browserLocale = navigator.language.toLowerCase()
  const detected = localeOptions.find((option) =>
    browserLocale.startsWith(option.value)
  )?.value
  return detected ?? "en"
}
