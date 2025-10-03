export async function parseISOStringToDate(
  dateString: string
): Promise<string> {
  const date = new Date(dateString);

  const dateLocale = date.toLocaleString("es-VE", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return dateLocale;
}
