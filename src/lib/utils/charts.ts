import type { GetUserTrackedDataBarChart } from "@/actions/get-user-tracked-data-bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type {
  ChartState,
  FocusChartDatum,
  SeriesDefinition,
} from "@/types/charts";
import { displayFormatter, rangeFormatter, weekdayFormatter } from "./dates";

const DAYS_TO_DISPLAY = 7;
const MAX_PRIMARY_SERIES = 5;
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

export function buildChartState(
  activities: GetUserTrackedDataBarChart,
): ChartState {
  const today = startOfDay(new Date());
  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - (DAYS_TO_DISPLAY - 1));

  const rangeEndExclusive = new Date(today);
  rangeEndExclusive.setDate(rangeEndExclusive.getDate() + 1);

  const dayBuckets = buildDayBuckets(rangeStart);
  const perDayProcessTotals: Record<string, Record<string, number>> = {};
  const weeklyProcessTotals = new Map<string, number>();

  for (const activity of activities) {
    if (!activity.timestamp || typeof activity.durationSeconds !== "number") {
      continue;
    }

    const activityDate = new Date(activity.timestamp);
    if (Number.isNaN(activityDate.valueOf())) continue;

    if (activityDate < rangeStart || activityDate >= rangeEndExclusive)
      continue;

    const dateKey = formatDateKey(activityDate);
    const bucket = dayBuckets.get(dateKey);
    if (!bucket) continue;

    const minutes = activity.durationSeconds / 60;
    if (!Number.isFinite(minutes) || minutes <= 0) continue;

    const processName = activity.processName?.trim() || "Unknown";

    if (processName === "loginwindow") continue;

    if (!perDayProcessTotals[dateKey]) perDayProcessTotals[dateKey] = {};
    perDayProcessTotals[dateKey][processName] =
      (perDayProcessTotals[dateKey][processName] ?? 0) + minutes;

    bucket.totalMinutes += minutes;

    weeklyProcessTotals.set(
      processName,
      (weeklyProcessTotals.get(processName) ?? 0) + minutes,
    );
  }

  const seriesDefinitions = buildSeriesDefinitions(weeklyProcessTotals);
  const chartConfig = buildChartConfig(seriesDefinitions);

  const chartData = Array.from(dayBuckets.values()).map((bucket) => {
    const dayTotals = perDayProcessTotals[bucket.dateKey] ?? {};
    const datum: FocusChartDatum = { ...bucket };

    for (const series of seriesDefinitions) {
      const minutes = series.processes.reduce(
        (sum, process) => sum + (dayTotals[process] ?? 0),
        0,
      );
      datum[series.key] = Number(minutes.toFixed(2));
    }
    return datum;
  });

  const hasData = chartData.some((datum) => datum.totalMinutes > 0);
  const rangeLabel = `${rangeFormatter.format(rangeStart)} – ${rangeFormatter.format(today)}`;

  return {
    data: chartData,
    processSeries: seriesDefinitions.map(({ key, label }) => ({ key, label })),
    chartConfig,
    rangeLabel,
    hasData,
  };
}

export function buildSeriesDefinitions(
  weeklyTotals: Map<string, number>,
): SeriesDefinition[] {
  const sortedTotals = Array.from(weeklyTotals.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  if (!sortedTotals.length) {
    return [];
  }

  const primary = sortedTotals.slice(0, MAX_PRIMARY_SERIES);
  const remainder = sortedTotals.slice(MAX_PRIMARY_SERIES);

  const series: SeriesDefinition[] = primary.map(([processName], index) => ({
    key: `process-${index}`,
    label: processName,
    processes: [processName],
  }));

  if (remainder.length) {
    series.push({
      key: "process-other",
      label: "Other",
      processes: remainder.map(([name]) => name),
    });
  }

  return series;
}

export function buildChartConfig(
  seriesDefinitions: SeriesDefinition[],
): ChartConfig {
  return seriesDefinitions.reduce<ChartConfig>((config, series, index) => {
    const colorToken = CHART_COLORS[index % CHART_COLORS.length];
    config[series.key] = {
      label: series.label,
      color: colorToken,
    };
    return config;
  }, {} satisfies ChartConfig);
}

export function buildDayBuckets(startDate: Date) {
  const buckets = new Map<string, FocusChartDatum>();

  for (let offset = 0; offset < DAYS_TO_DISPLAY; offset += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + offset);
    const dateKey = formatDateKey(date);

    buckets.set(dateKey, {
      day: weekdayFormatter.format(date),
      dateKey,
      displayDate: displayFormatter.format(date),
      totalMinutes: 0,
    });
  }

  return buckets;
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
