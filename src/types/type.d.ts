declare type ModelSliceType = {
  loginModel: boolean;
};

declare type HomeDesignStateType = {
  selected: string | null;
  isDeleting: string | null;
  isPublished: string | null;
  isCreating: boolean;
  news: News[];
};

declare type LoginResponse = {
  header: {
    code: number;
    message: string;
  };
  response: {
    access_token: string;
    firstname: string;
    lastname: string;
  };
};

declare type News = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  is_active: boolean;
  is_published: boolean;
  tile_space: string;
};

declare type ResponseHeader = {
  code: number;
  message: string;
};

declare type NewsCreateResponse = {
  header: ResponseHeader;
  response: News;
};

declare type NewCreateRequest = {
  title: string;
  description: string;
  tile_space: string;
  is_active: boolean;
  is_published: boolean;
};

declare type NewsListResponse = {
  header: {
    code: number;
    message: string;
  };
  response: News[];
};

declare type DeleteNewsResponse = {
  header: ResponseHeader;
  response: {};
};

declare type CreateSessionResponse = {
  header: ResponseHeader;
  response: {
    session_id: string;
    title: string;
  };
};

declare type Session = {
  sno: number;
  session_id: string;
  title: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string;
  speakers: string[];
  attachments: File[];
  external_link: string;
  description: string;
  created_on: string;
};

declare type CreateSessionRequest = Omit<
  Session,
  "sno" | "session_id" | "created_on"
>;

declare type SessionListResponse = {
  header: ResponseHeader;
  response: Session[];
};

declare type DeleteSessionResponse = {
  header: ResponseHeader;
  response: {
    session_id: string;
  };
};

declare type CreateSpeakerResponse = {
  header: ResponseHeader;
  response: {
    speaker_id: string;
    name: string;
  };
};

declare type CreateSpeakerRequest = {
  name: string;
  designation: string;
  company: string;
  bio: string;
  external_link: string;
  attachments: string[];
};

declare type SpeakerListResponse = {
  header: ResponseHeader;
  response: (CreateSpeakerRequest & {
    speaker_id: string;
    created_on: string;
  })[];
};

declare type DeleteSpeakerResponse = {
  header: ResponseHeader;
  response: {
    speaker_id: string;
  };
};

declare type AppConfig = {
  id: number;
  color_schema: {
    primary_color: string;
    secondary_color: string;
  };
  logo: {
    url: string;
    name: string;
  };
  text_style: {
    heading_1: string;
    heading_2: string;
    heading_3: string;
    font_family: string;
    all_other_text: string;
  };
};

declare type GlobalDesignResponse = {
  header: ResponseHeader;
  response: AppConfig;
};

declare type ConferenceProgramme = {
  conference_title: string;
  conference_start_date: string;
  conference_end_date: string;
  conference_location: string;
  speaker_list: (CreateSpeakerRequest & {
    speaker_id: string;
    created_on: string;
  })[];
};

declare type GlobalSpeakerListResponse = {
  header: ResponseHeader;
  response: ConferenceProgramme;
};

declare type NavItem = {
  label: string;
  route: string;
  pageId: string;
};

declare type GlobalNavMenuResponse = {
  header: ResponseHeader;
  response: NavItem[];
};

declare type GlobalVenue = {
  conference_title: string;
  conference_start_date: string;
  conference_end_date: string;
  conference_location: string;
  getting_there: {
      sub_title: string,
      description: string,
      latitude: string,
      longitude: string
    },
    floor_plan: string,
    visa_info: {
      title: string,
      sub_title: string,
      description: string
    },
    travel_info: {
      title: string,
      description: string
    }
};

declare type GlobalVenueResponse = {
  header: ResponseHeader;
  response: GlobalVenue;
};

declare type SpeakerSetting = {
  conference_title: string;
  conference_start_date: string;
  conference_end_date: string;
  conference_start_time: string;
  conference_end_time: string;
  conference_location: string;
  show_speaker_fullname: boolean;
  show_short_name: boolean;
  show_linkedin_badge: boolean;
  show_no_of_sessions: boolean;
  show_bio: boolean;
  is_active: boolean;
};

declare type SpeakerSettingResponse = {
  header: ResponseHeader;
  response: SpeakerSetting;
};

declare type GlobalProgrammeListResponse = {
  header: ResponseHeader;
  response: {
    conference_title: string;
    conference_start_date: string;
    conference_end_date: string;
    conference_location: string;
    programme: Omit<Session, "session_id">[];
  };
};
