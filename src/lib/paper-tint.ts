export type PaperTintClasses = {
  editorClassName: string;
  swatchClassName: string;
};

const defaultPaperTintClasses: PaperTintClasses = {
  editorClassName: "bg-white/92",
  swatchClassName: "bg-surface-container-lowest",
};

const paperTintClassMap: Record<string, PaperTintClasses> = {
  mist: defaultPaperTintClasses,
  rose: {
    editorClassName: "bg-rose-50/90",
    swatchClassName: "bg-rose-100",
  },
  sage: {
    editorClassName: "bg-emerald-50/88",
    swatchClassName: "bg-emerald-100",
  },
  sky: {
    editorClassName: "bg-sky-50/88",
    swatchClassName: "bg-sky-100",
  },
};

export function getPaperTintClasses(code?: string): PaperTintClasses {
  if (!code) {
    return defaultPaperTintClasses;
  }

  return paperTintClassMap[code] ?? defaultPaperTintClasses;
}
