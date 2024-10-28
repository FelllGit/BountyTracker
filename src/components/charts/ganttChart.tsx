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

interface IGanttChartProps {
  projectsData: CrowdsourcedAudit[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const GanttChart: React.FC<IGanttChartProps> = ({ projectsData }) => {
  if (!projectsData) {
    return <div>No data</div>;
  }

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const sidebarWidth = isMobile ? 60 : isTablet ? 100 : 150;

  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment()
    .endOf("month")
    .subtract(1, "week")
    .add(isMobile ? 0 : isTablet ? 5 : 10, "days");

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

  const platformColors: Record<string, string> = {
    HackenProof: "#871787",
    Cantina: "#fa540a",
    Immunefi: "#EB3678",
    Sherlock: "#240293",
  };

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
          title: `${project.project} - ${project.maxReward} ${project.rewardsToken} - ${project.languages}`,
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
              height: "auto",
              minHeight: "18px",
              display: "flex",
              alignItems: "center",
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
        items={items}
        traditionalZoom={true}
        onZoom={(start, end) => {
          console.log(start, end);
        }}
        defaultTimeStart={startOfMonth}
        defaultTimeEnd={endOfMonth}
        lineHeight={25} // Увеличенная высота строки
        itemHeightRatio={0.8} // Увеличенное соотношение высоты элемента
        sidebarWidth={sidebarWidth}
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
        <TimelineHeaders className="!bg-transparent">
          <DateHeader unit="month" className="*:!bg-white *:!text-base" />
          <DateHeader
            unit="day"
            className="*:!bg-[#ADADAD] *:!text-white *:!text-sm whitespace-nowrap"
          />
        </TimelineHeaders>
      </Timeline>
      <style jsx global>{`
        .react-calendar-timeline .rct-header-root {
          font-size: 14px;
        }
        .react-calendar-timeline .rct-sidebar {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default GanttChart;
