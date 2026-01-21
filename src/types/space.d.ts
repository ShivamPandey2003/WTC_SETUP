declare type BaseShape = {
  id: string;
  type: string;
  fillColor?: string;
  strokeWidth?: number;
  strokeColor?:string
  locked?:boolean
  name?:string
};

declare type RectangleShape = BaseShape & {
  x: number;
  y: number;
  width: number;
  height: number;
};

declare type CircleShape = BaseShape & {
  x: number;
  y: number;
  radius: number;
};

declare type PointShape = BaseShape & {
  points: number[];
  isErasing?: boolean;
};

declare type ArrowShape = PointShape;
declare type LineShape = PointShape;
declare type ScribbleShape = PointShape;

declare type StarShape = BaseShape & {
  x: number;
  y: number;
  innerRadius: number;
  outerRadius: number;
  numPoints: number;
};

declare type PolygonShape = BaseShape & {
  x: number;
  y: number;
  sides: number;
  radius: number;
};

declare type ImageShape = BaseShape & {
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

declare type TextShape = BaseShape & {
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
};

declare type Shape =
  | RectangleShape
  | CircleShape
  | ArrowShape
  | LineShape
  | ScribbleShape
  | StarShape
  | PolygonShape
  | ImageShape
  | TextShape;
