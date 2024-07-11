export default function getStringValue(value: unknown) {
  if (value instanceof Object) {
    if (String(value) === "[object Object]") {
      return JSON.stringify(value);
    }
  }
  return String(value);
}
