export function getPagination(
  currentPage: number,
  totalPages: number
) {
  const delta = 2;

  const range: (number | string)[] = [];

  const result: (number | string)[] = [];

  let last: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta &&
        i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (const page of range) {
    if (last !== undefined) {
      if (Number(page) - last === 2) {
        result.push(last + 1);
      } else if (
        Number(page) - last > 2
      ) {
        result.push("...");
      }
    }

    result.push(page);

    last = Number(page);
  }

  return result;
}