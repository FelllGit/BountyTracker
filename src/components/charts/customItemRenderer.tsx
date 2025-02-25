import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ReactCalendarItemRendererProps,
  TimelineGroupBase,
} from "react-calendar-timeline";
import { motion } from "framer-motion";

interface CustomCSSProperties extends React.CSSProperties {
  "--scroll-duration"?: string;
  groups: TimelineGroupBase[];
}

interface CustomItemRendererProps extends ReactCalendarItemRendererProps {
  groups: TimelineGroupBase[];
}

const CustomItemRenderer = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps,
  groups,
}: CustomItemRendererProps) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const baseStyle: React.CSSProperties =
    (item.itemProps && item.itemProps.style) || {};
  const customStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: baseStyle.backgroundColor,
  };
  const itemProps = getItemProps({ ...item.itemProps, style: customStyle });
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [scrollDuration, setScrollDuration] = useState("10s");
  const groupName =
    groups.find((group) => group.id === item.group)?.title || "";

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && textRef.current.parentElement) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = textRef.current.parentElement.offsetWidth;

        if (textWidth > containerWidth) {
          setShouldAnimate(true);
          const speed = 50;
          const duration = (textWidth + containerWidth) / speed;
          setScrollDuration(`${duration}s`);
        } else {
          setShouldAnimate(false);
        }
      }
    };

    checkOverflow();

    const parentElement = textRef.current?.parentElement;
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (parentElement) {
      resizeObserver.observe(parentElement);
    }

    return () => {
      if (parentElement) {
        resizeObserver.unobserve(parentElement);
      }
    };
  }, [item.title, textRef]);

  return (
    <motion.div
      {...itemProps}
      className={shouldAnimate ? "overflow-x-hidden !z-50" : "!z-50"}
      whileHover={
        groupName === "Cantina"
          ? {
              x: [0, -12, 12, -12, 12, 0],
              transition: {
                duration: 0.4,
              },
            }
          : {}
      }
    >
      {itemContext.useResizeHandle && <div {...leftResizeProps} />}
      <div
        ref={textRef}
        className="custom-item-content"
        style={
          {
            maxHeight: `${itemContext.dimensions.height}px`,
            "--scroll-duration": scrollDuration,
          } as CustomCSSProperties
        }
      >
        <div className={shouldAnimate ? "animate-text" : ""}>{item.title}</div>
      </div>
      {itemContext.useResizeHandle && <div {...rightResizeProps} />}
    </motion.div>
  );
};

export default CustomItemRenderer;
