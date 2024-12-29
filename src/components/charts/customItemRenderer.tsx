import React, { useLayoutEffect, useRef, useState } from "react";
import { ReactCalendarItemRendererProps } from "react-calendar-timeline";

interface CustomCSSProperties extends React.CSSProperties {
  "--scroll-duration"?: string;
}

const CustomItemRenderer = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps,
}: ReactCalendarItemRendererProps) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const itemProps = getItemProps(item.itemProps ?? {});
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [scrollDuration, setScrollDuration] = useState("10s");

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
    <div {...itemProps}>
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
    </div>
  );
};

export default CustomItemRenderer;
