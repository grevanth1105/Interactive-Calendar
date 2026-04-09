export const HOLIDAYS = [
  { month: 0, date: 1, name: "New Year's Day" },
  { month: 1, date: 14, name: "Valentine's Day" },
  { month: 2, date: 17, name: "St. Patrick's Day" },
  { month: 3, date: 1, name: "April Fools' Day" },
  { month: 3, date: 22, name: "Earth Day" },
  { month: 4, date: 1, name: "Labor Day" },
  { month: 5, date: 21, name: "Summer Solstice" },
  { month: 6, date: 4, name: "Independence Day" },
  { month: 7, date: 26, name: "Women's Equality Day" },
  { month: 9, date: 31, name: "Halloween" },
  { month: 10, date: 11, name: "Veterans Day" },
  { month: 11, date: 25, name: "Christmas Day" },
  { month: 11, date: 31, name: "New Year's Eve" },
];

export function getHoliday(date: Date) {
  // getMonth() is 0-indexed in JS (0 = Jan, 11 = Dec)
  return HOLIDAYS.find((h) => h.month === date.getMonth() && h.date === date.getDate());
}
