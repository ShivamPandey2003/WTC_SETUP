import { TbRectangle } from "react-icons/tb";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { CiEraser } from "react-icons/ci";
import { FaMinus } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { BiSolidPolygon } from "react-icons/bi";
import { MdTextFields } from "react-icons/md";

export const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  SCRIBBLE: "SCRIBBLE",
  ARROW: "ARROW",
  ERASER: "ERASER",
  TEXT: "TEXT",
//   ARC: "ARC",
  LINE: "LINE",
  STAR: "STAR",
  POLYGON: "POLYGON",
//   WEDGE: "WEDGE",
  IMAGE: "IMAGE",
//   LOCK: "LOCK",
};

export const ActionsIcons = {
  SELECT: { icon: GiArrowCursor, size: "1.5rem" },
  RECTANGLE: { icon: TbRectangle, size: "1.5rem" },
  CIRCLE: { icon: FaRegCircle, size: "1.5rem" },
  ARROW: { icon: FaLongArrowAltRight, size: "1.5rem" },
  LINE: { icon: FaMinus, size: "1.5rem" },
  SCRIBBLE: { icon: LuPencil, size: "1.5rem" },
  STAR: { icon: FaStar, size: "1.5rem" },
  POLYGON: { icon: BiSolidPolygon, size: "1.5rem" },
  TEXT: { icon: MdTextFields, size: "1.5rem" },
  ERASER: { icon: CiEraser, size: "1.5rem" },
};
