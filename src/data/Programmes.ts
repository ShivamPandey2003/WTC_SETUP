import type { OutputItem } from "@/lib/extra";

export default {
  start_date: "2025-11-25",
  start_time: "09:00:00",
  end_date: "2025-11-29",
  end_time: "17:00:00",
  data: {
    "2025-11-29": [
      {
        session_id: "QhfWf6yV573AGF",
        id: "cMvj1OlLy8Gl8rdFsRV5H",
        title: "Technical",
        start: "10:00:00",
        end: "11:00:00",
        color: "#e9c5ff",
        type: "normal",
      },
    ],
    "2025-11-28": [
      {
        id: "6Iz7yO5E4Hp_4dCSThake",
        type: "merge",
        title: "Development",
        color: "#C7E3F4",
        start: "10:00:00",
        end: "12:00:00",
        session_id: ["OQR52Iq5El", "tDWOaggtMKKFZ", "cJGIk9uQcUPZKyV"],
      },
      {
        session_id: "ksBr3xTaVRyALbbc",
        id: "yDUIyc3p3_NU8HNsQAjE8",
        title: "Technical",
        start: "09:00:00",
        end: "17:00:00",
        color: "#e9c5ff",
        type: "extra",
      },
    ],
    "2025-11-27": [
      {
        id: "ZjmJu2-EVGdOwHClIbSTD",
        type: "array",
        start: "11:00:00",
        end: "12:00:00",
        Item: [
          {
            session_id: "m6o9Bd65G1e",
            id: "9ZqPXgA8HcFsUOeJ8RW0r",
            title: "Development",
            start: "11:00:00",
            end: "12:00:00",
            color: "#C7E3F4",
          },
          {
            session_id: "woSkbpO4NOiY",
            id: "koMnuoNLdpdX35hJqkkkw",
            title: "Technical",
            start: "11:00:00",
            end: "12:00:00",
            color: "#e9c5ff",
          },
          {
            session_id: "SsmTNAmfUu",
            id: "N_3hIWwsrGK3ArtkO_qo5",
            title: "ITA-CTA Training",
            start: "11:00:00",
            end: "12:00:00",
            color: "#FED698",
          },
        ],
      },
    ],
    "2025-11-26": [
      {
        id: "FLalb9cbUo7iE9d2KF6Ph",
        type: "array",
        start: "10:00:00",
        end: "11:00:00",
        Item: [
          {
            session_id: "TVlf482Uww47W",
            id: "shspxCxRD4bxP1X3dVarx",
            title: "ITA-CTA Training",
            start: "10:00:00",
            end: "11:00:00",
            color: "#FED698",
          },
          {
            session_id: "d8bFIO9S4PSeSJzf",
            id: "tfshVykZh3vJtgj5qLZKi",
            title: "Development",
            start: "10:00:00",
            end: "11:00:00",
            color: "#C7E3F4",
          },
        ],
      },
      {
        session_id: "nOXIHPCVHpBkYBew",
        id: "Qy5XE9mkSfFV35u9LtZea",
        title: "Technical",
        start: "10:00:00",
        end: "17:00:00",
        color: "#e9c5ff",
        type: "extra",
      },
      {
        session_id: "A9q1PJemC9CNYsUL",
        id: "-xcBJA3h8Z3Yl_M6ZSZ9V",
        title: "Coffee",
        start: "09:00:00",
        end: "10:00:00",
        color: "#FFA6A8",
        type: "normal",
      },
    ],
    "2025-11-25": [
      {
        session_id: "FXEcOoGjTb3UrYK",
        id: "jQzubdjycaLFlqVVurwHj",
        title: "Break",
        start: "11:00:00",
        end: "11:30:00",
        color: "#98EEB6",
        type: "normal",
      },
      {
        session_id: "WcjC9ynJSx",
        id: "F2B7spJaihgZFskDsMCRy",
        title: "ITA-CTA Training",
        start: "10:00:00",
        end: "11:00:00",
        color: "#FED698",
        type: "normal",
      },
      {
        session_id: "B7j3NHD6goRcNR",
        id: "vMl0gRg4iIjSlAtDjM78z",
        title: "ITA-CTA Training",
        start: "11:30:00",
        end: "12:30:00",
        color: "#FED698",
        type: "normal",
      },
      {
        session_id: "LWwSrIxfkz",
        id: "3ohapiSVq7hVW_9zR6ktF",
        title: "Technical",
        start: "12:30:00",
        end: "14:30:00",
        color: "#e9c5ff",
        type: "normal",
      },
    ],
  },
} as {
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  data: Record<string, OutputItem[]>;
};;
