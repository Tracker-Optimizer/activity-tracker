import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions/get-session";
import { getUserTrackedData } from "@/actions/get-user-tracked-data";
import { getUserTrackedDataBarChart } from "@/actions/get-user-tracked-data-bar-chart";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { buildChartState } from "@/lib/utils/charts";
import { TrackDataChart } from "./_components/track-data-chart";
import { UserActivityTable } from "./_components/user-activity-table";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) redirect("/signup");

  const [rawChartData, activities] = await Promise.all([
    getUserTrackedDataBarChart(session.user.id),
    getUserTrackedData(session.user.id),
  ]);

  if (!rawChartData) redirect("/profile");

  const chartState = buildChartState(rawChartData);

  return (
    <>
      <SiteHeader title="Dashboard" />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <TrackDataChart chartState={chartState} />
            </div>

            <div className="px-4 lg:px-6">
              <UserActivityTable activities={activities} />
            </div>

            <SectionCards />
          </div>
        </div>
      </div>
    </>
  );
}
