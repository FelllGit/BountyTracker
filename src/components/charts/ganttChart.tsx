"use client";

import moment from "moment/moment";
import Timeline, {
  TimelineGroupBase,
  TimelineItemBase,
  TimelineHeaders,
  DateHeader,
  CustomMarker,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { CrowdsourcedAudit } from "@/interfaces/CrowdsourcedAudit";
import { useMediaQuery } from "react-responsive";
import CustomItemRenderer from "@/components/charts/customItemRenderer";
import getPlatformColors from "@/utils/getPlatformColors";
import { EPlatformName } from "@/interfaces/PlatformNames";

interface IGanttChartProps {
  projectsData: CrowdsourcedAudit[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const GanttChart: React.FC<IGanttChartProps> = ({ projectsData }) => {
  const isMobile = useMediaQuery({ maxWidth: 600 });
  const isTablet = useMediaQuery({ minWidth: 600, maxWidth: 1024 });

  const platformColors: Record<string, string> = getPlatformColors();

  const sidebarWidth = isMobile ? 80 : isTablet ? 100 : 150;

  const startOfMonth = moment().subtract(1, "week");
  const endOfMonth = moment()
    .add(1, "month")
    .subtract(1, "week")
    .add(isMobile ? -15 : isTablet ? 5 : 10, "days");

  const allPlatforms: EPlatformName[] =
    projectsData?.map((p) => p.platform as EPlatformName) ?? [];

  const uniquePlatforms = Array.from(new Set(allPlatforms));
  const groups: TimelineGroupBase[] = uniquePlatforms.map(
    (platform, index) => ({
      id: index + 1,
      title: platform,
      rightTitle: "Platform",
      stackItems: true,
    })
  );

  const groupColors: Record<number, string> = groups.reduce<
    Record<number, string>
  >((acc, group) => {
    acc[group.id as number] =
      platformColors[group.title as EPlatformName] ?? "#CCCCCC";
    return acc;
  }, {});

  if (!projectsData || !platformColors) {
    return (
      <div className="h-24 text-sm text-center text-card-foreground">
        Loading...
      </div>
    );
  }

  const items: TimelineItemBase<number>[] = projectsData
    ? projectsData.map((project, index) => {
        const groupId =
          groups.find((group) => group.title === project.platform)?.id ?? 0;

        const validatedGroupId: number =
          typeof groupId === "number" ? groupId : 0;

        return {
          id: index + 1,
          group: validatedGroupId,
          title: `${project.project} - $${project.maxReward} - ${project.languages && project.languages.length > 0 ? project.languages.slice(0, 2).join(", ") : "null"} - Days left: ${Math.max(0, Math.min(moment(project.endDate).diff(moment(project.startDate), "days"), moment(project.endDate).diff(moment(), "days")))}`,
          start_time: moment(project.startDate).valueOf(),
          end_time: moment(project.endDate).valueOf(),
          canMove: false,
          canResize: false,
          canChangeGroup: false,
          itemProps: {
            style: {
              backgroundColor: groupColors[validatedGroupId],
              fontSize: isMobile ? "12px" : "14px",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              minHeight: "18px",
              overflow: "hidden",
            },
            onClick: () => {
              window.open(project.originalUrl, "_blank");
            },
            onTouchEnd: (): void => {
              window.open(project.originalUrl, "_blank");
            },
          },
        };
      })
    : [];

  return (
    <div className="timeline-container">
      <Timeline
        groups={groups}
        groupRenderer={(prop) => (
          <p className={"text-card-foreground"}>{prop.group.title}</p>
        )}
        items={items}
        traditionalZoom={true}
        defaultTimeStart={startOfMonth}
        defaultTimeEnd={endOfMonth}
        lineHeight={25}
        itemHeightRatio={0.8}
        sidebarWidth={sidebarWidth}
        itemRenderer={(props) => (
          <CustomItemRenderer {...props} groups={groups} />
        )}
      >
        <CustomMarker date={moment().toDate()}>
          {({ styles }) => {
            const customStyles = {
              ...styles,
              background: "red",
              width: "4px",
            };
            return <div style={customStyles} />;
          }}
        </CustomMarker>
        <TimelineHeaders className="!bg-transparent border-border *:border-border">
          <DateHeader
            unit="month"
            className="*:!bg-background *:!border-border !border-border *:!text-card-foreground"
          />
          <DateHeader
            unit="day"
            className="*:!bg-[#ADADAD] dark:*:!bg-[#464C4F] *:!border-border *:!text-white *:!text-sm whitespace-nowrap"
          />
        </TimelineHeaders>
      </Timeline>
      <style jsx global>{`
        .react-calendar-timeline .rct-header-root {
          font-size: 14px;
          border-color: var(--border) !important;
        }
        .react-calendar-timeline .rct-sidebar {
          font-size: 14px;
          border-color: var(--border) !important;
        }
      `}</style>
    </div>
  );
};

export default GanttChart;
