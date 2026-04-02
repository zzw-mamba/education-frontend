export const TEMPLATE_CATEGORY_DICT = {
  0: "通用",
  1: "商业",
  2: "技术",
  3: "管理",
  4: "论文",
};

export const TEMPLATE_CATEGORY_OPTIONS = Object.entries(
  TEMPLATE_CATEGORY_DICT
).map(([value, label]) => ({
  value: Number(value),
  label,
}));

export const getTemplateCategoryLabel = (category) => {
  if (category === undefined || category === null) return "未分类";

  const raw = String(category).trim();
  if (!raw) return "未分类";

  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    return TEMPLATE_CATEGORY_DICT[n] || `分类${n}`;
  }

  return raw;
};

export const getTemplateCategoryCode = (category) => {
  if (typeof category === "number" && Number.isInteger(category)) {
    return category;
  }

  const raw = String(category ?? "").trim();
  if (!raw) return 0;
  if (/^\d+$/.test(raw)) return Number(raw);

  const hit = Object.entries(TEMPLATE_CATEGORY_DICT).find(
    ([, label]) => label === raw
  );
  return hit ? Number(hit[0]) : 0;
};
