export function updateWidgetsPositionAndSize(
  widgetsData: Array<{
    id?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }>
) {
  return fetch("/api/widget/updatePositionAndSize", {
    method: "POST",
    body: JSON.stringify(widgetsData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
