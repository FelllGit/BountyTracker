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
import { useEffect, useState } from "react";

interface IGanttChartProps {
  projectsData: CrowdsourcedAudit[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const GanttChart: React.FC<IGanttChartProps> = ({ projectsData }) => {
  const [platformColors, setPlatformColors] = useState<Record<string, string>>(
    {}
  );

  const isMobile = useMediaQuery({ maxWidth: 600 });
  const isTablet = useMediaQuery({ minWidth: 600, maxWidth: 1024 });

  const sidebarWidth = isMobile ? 80 : isTablet ? 100 : 150;

  const startOfMonth = moment().subtract(1, "week");
  const endOfMonth = moment()
    .add(1, "month")
    .subtract(1, "week")
    .add(isMobile ? -15 : isTablet ? 5 : 10, "days");

  const allPlatforms =
    projectsData &&
    projectsData.reduce<string[]>((acc, curr) => [...acc, curr.platform], []);

  const uniquePlatforms = Array.from(new Set(allPlatforms));
  const groups = uniquePlatforms.map((platform, index) => ({
    id: index + 1,
    title: platform,
    rightTitle: "Platform",
    stackItems: true,
  })) as TimelineGroupBase[];

  const updateColors = () => {
    const styles = getComputedStyle(document.documentElement);
    setPlatformColors({
      HackenProof: styles.getPropertyValue("--hackenProof").trim(),
      Cantina: styles.getPropertyValue("--cantina").trim(),
      Immunefi: styles.getPropertyValue("--immunefi").trim(),
      Sherlock: styles.getPropertyValue("--sherlock").trim(),
      code4rena: styles.getPropertyValue("--code4rena").trim(),
      CodeHawks: styles.getPropertyValue("--codeHawks").trim(),
      HatsFinance: styles.getPropertyValue("--hatsFinance").trim(),
    });
  };

  useEffect(() => {
    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!projectsData || !platformColors) {
    return <div className="h-24 text-sm text-center">Loading...</div>;
  }

  const groupColors: Record<number, string> = groups.reduce(
    (acc: Record<number, string>, group: TimelineGroupBase) => {
      if (typeof group.id === "number" && typeof group.title === "string") {
        acc[group.id] = platformColors[group.title] || "#CCCCCC";
      }
      return acc;
    },
    {}
  );

  const items: TimelineItemBase<number>[] = projectsData
    ? projectsData.map((project, index) => {
        const groupId =
          groups.find((group) => group.title === project.platform)?.id ?? 0;

        const validatedGroupId: number =
          typeof groupId === "number" ? groupId : 0;

        return {
          id: index + 1,
          group: validatedGroupId,
          title: `${project.project} - $${project.maxReward} - ${project.languages.length > 0 ? project.languages.slice(0, 2).join(", ") : "null"} - Days left: ${Math.max(0, Math.min(moment(project.endDate).diff(moment(project.startDate), "days"), moment(project.endDate).diff(moment(), "days")))}`,
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
              // overflow: "hidden",
            },
            onMouseDown: () => {
              window.open(project.originalUrl, "_blank", "noopener,noreferrer");
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
