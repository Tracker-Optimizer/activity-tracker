export const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

export const displayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export const formatMinutesValue = (value: number) => {
  if (!value) return "0m";
  if (value < 60) {
    return `${value.toFixed(value < 10 ? 1 : 0)}m`;
  }
  const hours = value / 60;
  return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
};
