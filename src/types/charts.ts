import type { ChartConfig } from "@/components/ui/chart";

export type ProcessSeriesMeta = {
  key: string;
  label: string;
};

export type FocusChartDatum = {
  day: string;
  dateKey: string;
  displayDate: string;
  totalMinutes: number;
} & Record<string, number | string>;

export type TrackDataChartClientProps = ChartState;

export type SeriesDefinition = ProcessSeriesMeta & {
  processes: string[];
};

export type ChartState = {
  data: FocusChartDatum[];
  processSeries: ProcessSeriesMeta[];
  chartConfig: ChartConfig;
  rangeLabel: string;
  hasData: boolean;
};
