import type { ChartState } from "@/types/charts";
import { TrackDataChartClient } from "./track-data-chart-client";

export const TrackDataChart = ({ chartState }: { chartState: ChartState }) => {
  return <TrackDataChartClient {...chartState} />;
};
