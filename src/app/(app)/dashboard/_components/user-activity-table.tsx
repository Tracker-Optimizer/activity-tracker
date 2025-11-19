"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { GetUserTrackedData } from "@/actions/get-user-tracked-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMinutesValue } from "@/lib/utils/dates";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

interface UserActivityTableProps {
  activities: GetUserTrackedData;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function UserActivityTable({ activities }: UserActivityTableProps) {
  const [query, setQuery] = useState("");
  const [processFilter, setProcessFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const normalizedQuery = query.trim().toLowerCase();

  const processOptions = useMemo(() => {
    const names = new Set<string>();
    for (const activity of activities) {
      if (activity.processName) {
        names.add(activity.processName.trim());
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let rows = activities;

    if (processFilter !== "all") {
      rows = rows.filter(
        (activity) => activity.processName?.trim() === processFilter,
      );
    }

    if (!normalizedQuery) return rows;

    return rows.filter((activity) => {
      const haystack = [
        activity.windowTitle,
        activity.browserTabTitle,
        activity.browserUrl,
        activity.processName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activities, normalizedQuery, processFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / pageSize),
  );

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(0);
    }
  }, [page, totalPages]);

  const paginatedActivities = useMemo(() => {
    const start = page * pageSize;
    return filteredActivities.slice(start, start + pageSize);
  }, [filteredActivities, page, pageSize]);

  return (
    <Card className="px-4 py-4 lg:px-6">
      <CardHeader className="flex flex-col gap-4 px-0 py-0">
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg font-semibold flex-1">
            Activity log
          </CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <InputGroup className="w-96 ml-auto">
              <InputGroupInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search tracked activity"
                placeholder="Search by app, title, or URL"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <Select
              value={processFilter}
              onValueChange={(value) => {
                setProcessFilter(value);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by process" />
              </SelectTrigger>
              <SelectContent align="end" className="max-h-64 overflow-y-auto">
                <SelectItem value="all">All processes</SelectItem>
                {processOptions.map((process) => (
                  <SelectItem key={process} value={process}>
                    {process}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/70">
              <TableRow>
                <TableHead className="w-[350px] max-w-[350px]">
                  Details
                </TableHead>
                <TableHead className="w-[200px]">Process</TableHead>
                <TableHead className="w-32 text-right">Duration</TableHead>
                <TableHead className="w-48">Start</TableHead>
                <TableHead className="w-48">End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActivities.length ? (
                paginatedActivities.map((activity) => {
                  const processName = activity.processName?.trim() || "Unknown";
                  const durationMinutes = activity.durationSeconds / 60;
                  const activityDetail =
                    activity.windowTitle ||
                    activity.browserTabTitle ||
                    activity.browserUrl ||
                    activity.processPath ||
                    "No additional details";

                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="align-top">
                        <p className="truncate text-sm text-muted-foreground">
                          {activityDetail}
                        </p>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex gap-2 items-center">
                          <span className="font-medium leading-none">
                            {processName}
                          </span>
                          {activity.isUserActive === false ? (
                            <Badge
                              variant="secondary"
                              size="sm"
                              className="mt-1 w-fit text-xs uppercase tracking-wide"
                            >
                              Idle
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatMinutesValue(durationMinutes)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {dateTimeFormatter.format(new Date(activity.timestamp))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {activity.endTimestamp
                          ? dateTimeFormatter.format(
                              new Date(activity.endTimestamp),
                            )
                          : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm">
                    No sessions match your search.
                  </TableCell>
                </TableRow>
              )}
              {!activities.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm">
                    No tracked sessions yet. Start the Activity Tracker to see
                    your timeline here.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {paginatedActivities.length ? page * pageSize + 1 : 0}–
            {Math.min((page + 1) * pageSize, filteredActivities.length)} of{" "}
            {filteredActivities.length} sessions
          </span>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
