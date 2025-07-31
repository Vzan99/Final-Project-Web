export function formatJobCategory(category: string) {
  return category
    .split("_")
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatEmploymentType(type: string) {
  return type
    .split("_")
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ");
}
