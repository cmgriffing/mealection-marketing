import React, { useState } from "react";
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryStack,
  VictoryArea,
  Area,
} from "victory";

const CustomArea = (props: any) => {
  if (!props.active) {
    return <Area {...props} />;
  } else {
    const { data, activeX, scale, style } = props;
    const index = data.findIndex((val: any) => val._x === activeX);
    const previousPoint = index === 0 ? activeX : data[index - 1]._x;
    const nextPoint = index === data.length - 1 ? activeX : data[index + 1]._x;
    // create a copy of the x dimension scale, and set the range to [0, 100] to easily calculate a percentage for the gradient offsets
    const percentScale = scale.x.copy().range([0, 100]);
    // calculate the percentages for current, previous, and next points
    const currentPercent = percentScale(activeX);
    const previousPercent = percentScale(previousPoint);
    const nextPercent = percentScale(nextPoint);
    const minPercent = currentPercent - (currentPercent - previousPercent) / 2;
    const maxPercent = currentPercent + (nextPercent - currentPercent) / 2;

    const gradientId = Math.random();
    const isBrowser =
      typeof window !== "undefined" &&
      (window as any).__STATIC_GENERATOR !== true;
    const loc = isBrowser ? window.location.href : "";
    const newStyle = Object.assign({}, style, {
      fill: `url(${loc}#${gradientId})`,
      stroke: "none",
    });

    return (
      <g>
        <defs>
          <linearGradient id={gradientId.toString()}>
            <stop offset="0%" stopColor={style.fill} />
            <stop offset={`${minPercent}%`} stopColor={style.fill} />
            <stop offset={`${minPercent}%`} stopColor={"tomato"} />
            <stop offset={`${maxPercent}%`} stopColor={"tomato"} />
            <stop offset={`${maxPercent}%`} stopColor={style.fill} />
            <stop offset="100%" stopColor={style.fill} />
          </linearGradient>
        </defs>
        <Area {...props} style={newStyle} />
      </g>
    );
  }
};

export function StackChart({
  keyedDataset,
  baseDataset,
  subDatasets,
}: {
  keyedDataset: { [key: string]: any };
  baseDataset: { x: number | string; y: number }[];
  subDatasets: { x: number | string; y: number }[][];
}) {
  const [activeX, setActiveX] = useState(0);
  const [currentSection, setCurrentSection] = useState({
    key: "",
    group: {} as any,
  });

  return (
    <div className="">
      <div className="flex flex-row">
        <div>
          <div>
            Total: {keyedDataset[baseDataset[baseDataset.length - 1].x].total}
          </div>
          <div>
            Resolved:{" "}
            {keyedDataset[baseDataset[baseDataset.length - 1].x].resolved}
          </div>
        </div>
        <div className="flex flex-grow"></div>
        {currentSection.key && (
          <div className="text-right">
            <div>
              <span className="pr-2">{currentSection.key}</span>
              Total: {currentSection.group.dailyTotal}
            </div>
            <div>Resolved: {currentSection.group.dailyResolved}</div>
          </div>
        )}
      </div>
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer
            onActivated={(points) => {
              setActiveX(points[0]._x);
              setCurrentSection({
                key: points[0].x,
                group: keyedDataset[points[0].x],
              });
            }}
          />
        }
      >
        <VictoryStack colorScale={"blue"}>
          <VictoryArea
            data={baseDataset}
            interpolation="linear"
            dataComponent={<CustomArea activeX={activeX} />}
          />
          {subDatasets.map((dataset, index) => (
            <VictoryArea
              key={index}
              data={dataset}
              interpolation="linear"
              dataComponent={<CustomArea activeX={activeX} />}
            />
          ))}
        </VictoryStack>
      </VictoryChart>
    </div>
  );
}
