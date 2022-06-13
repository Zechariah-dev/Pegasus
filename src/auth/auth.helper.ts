export function validateAge(dob: any) {
  const now = new Date().toDateString();
  const diff = Date.parse(now) - Date.parse(dob);
  const diffYear = new Date(diff).getUTCFullYear();
  return diffYear - 1970 >= 18;
}
