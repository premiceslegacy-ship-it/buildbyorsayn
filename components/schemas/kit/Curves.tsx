import { KitFrame } from "./KitFrame";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type CurveSeries = {
  name: string;
  values: readonly number[];
  kind?: "line" | "step";
  accent?: boolean;
};

export type CurveAnnotation = {
  series: number;
  point: number;
  label: string;
};

export type CurvesProps = KitBaseProps & {
  labels: readonly string[];
  series: readonly CurveSeries[];
  annotations?: readonly CurveAnnotation[];
};

function makePath(values: readonly number[], minimum: number, maximum: number, kind: "line" | "step") {
  const width = 540;
  const height = 196;
  const range = Math.max(maximum - minimum, 1);
  const point = (value: number, index: number) => ({
    x: values.length === 1 ? width / 2 : index * (width / (values.length - 1)),
    y: height - ((value - minimum) / range) * height,
  });
  const points = values.map(point);
  if (!points.length) return "";
  return points.slice(1).reduce((path, current) => {
    return kind === "step"
      ? `${path} H ${current.x} V ${current.y}`
      : `${path} L ${current.x} ${current.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

export function Curves({ labels, series, annotations = [], ...frame }: CurvesProps) {
  const values = series.flatMap((item) => [...item.values]);
  const minimum = Math.min(...values, 0);
  const maximum = Math.max(...values, 1);
  const position = (curve: CurveSeries, pointIndex: number) => {
    const x = curve.values.length === 1 ? 270 : pointIndex * (540 / (curve.values.length - 1));
    const y = 196 - ((curve.values[pointIndex] - minimum) / Math.max(maximum - minimum, 1)) * 196;
    return { x, y };
  };
  return <KitFrame {...frame} kind="curves">
    <div className={styles.curveLegend}>{series.map((item) => <span className={item.accent ? styles.isAccent : undefined} key={item.name}><i />{item.name}</span>)}</div>
    <div className={styles.curvePlot}>
      <div className={styles.curveChart}>
        <svg viewBox="0 0 560 236" aria-hidden="true" preserveAspectRatio="none">
          <path className={styles.curveAxis} d="M 10 206 H 550" />
          {series.map((item) => <path
            className={`${styles.curveLine} ${item.accent ? styles.curveAccent : ""}`}
            d={makePath(item.values, minimum, maximum, item.kind ?? "line")}
            transform="translate(10 8)"
            key={item.name}
          />)}
        </svg>
        {annotations.map((annotation) => {
          const curve = series[annotation.series];
          const point = curve ? position(curve, annotation.point) : { x: 0, y: 0 };
          return <span
            className={styles.curveAnnotation}
            data-below={point.y < 34 ? "true" : undefined}
            data-edge={point.x > 420 ? "true" : undefined}
            style={{ left: `${((point.x + 10) / 560) * 100}%`, top: `${((point.y + 8) / 236) * 100}%` }}
            key={`${annotation.label}-${annotation.series}-${annotation.point}`}
          ><i /><b>{annotation.label}</b></span>;
        })}
      </div>
      <div className={styles.curveLabels} data-label-count={labels.length} style={{ "--kit-labels": labels.length } as React.CSSProperties}>{labels.map((label) => <span key={label}>{label}</span>)}</div>
    </div>
  </KitFrame>;
}
