export const UploadTypeEnum = {
  SPEAKER_PROFILE: 1,
  EXHIBITOR_LOGO: 2,
  PROGRAMME_ATTACHMENT: 3,
  SPEAKER_ATTACHMENT: 4,
  NEWS_IMAGE: 5,
  PROGRAMME_BG_IMAGE: 6,
} as const;

export const CSVUploadEnum = {
  session_csv: "session",
  speaker_csv: "speaker",
  exhibitor_csv: "exhibitor",
  news_csv: "news",
} as const;