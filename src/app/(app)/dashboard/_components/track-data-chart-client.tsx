"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMinutesValue } from "@/lib/utils/dates";
import type { TrackDataChartClientProps } from "@/types/charts";

export function TrackDataChartClient({
  data,
  processSeries,
  chartConfig,
  rangeLabel,
  hasData,
}: TrackDataChartClientProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Focus by app</CardTitle>
        <CardDescription>Last 7 days · {rangeLabel}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <BarChart data={data} margin={{ left: -12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatMinutesValue(Number(value))}
                width={48}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                content={<ChartTooltipContent />}
              />
              {processSeries.length > 1 ? (
                <ChartLegend content={<ChartLegendContent />} />
              ) : null}
              {processSeries.map((series, index) => {
                const radius: [number, number, number, number] =
                  index === processSeries.length - 1
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0];
                return (
                  <Bar
                    key={series.key}
                    dataKey={series.key}
                    stackId="focus"
                    radius={radius}
                    fill={`var(--color-${series.key})`}
                  />
                );
              })}
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[220px] flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
            <p>No tracked activity for this week yet.</p>
            <p className="text-xs uppercase tracking-wide">{rangeLabel}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
