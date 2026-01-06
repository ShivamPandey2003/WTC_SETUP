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
  bg_img: null | string;
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
  session_id: string;
  title: string;
  category: string[];
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  speakers: string[];
  external_link: string;
  description: string;
  bg_img: null | string;
  is_active: boolean;
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
  created_on: string;
  user_img: string;
  coming_sessions: Record<string, string>[];
  total_sessions: number;
};

declare type CreateSpeakerRequestT = {
  prefix: string;
  firstname: string;
  lastname: string;
  designation: string;
  company: string;
  bio: string;
  external_link: string;
  created_on: string;
  attachments: {
    filename: string;
    speaker_image: string;
  }[];
  coming_sessions: Record<string, string>[];
  total_sessions: number;
  keyNote: boolean;
};

declare type SpeakerListResponse = {
  header: ResponseHeader;
  response: (CreateSpeakerRequestT & {
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
    logo_img: string;
  };
  text_style: {
    heading_1: string;
    heading_2: string;
    heading_3: string;
    font_family: string;
    all_other_text: string;
  };
  sponsors: {
    logo: string;
  };
  home_design: {
    home_title: string;
    upcoming_session: boolean;
    gold_exhibitors_session: boolean;
    keynote_speaker_session: boolean;
    advertisements: boolean;
    exhibitors_with_ad: boolean;
  };
};

declare type GlobalDesignResponse = {
  header: ResponseHeader;
  response: AppConfig;
};

declare type GlobalSpeakerListResponse = {
  header: ResponseHeader;
  response: (CreateSpeakerRequest & {
    speaker_id: string;
  })[];
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
  getting_there: {
    sub_title: string;
    description: string;
    latitude: string;
    longitude: string;
  };
  floor_plan: string;
  visa_info: {
    title: string;
    sub_title: string;
    description: string;
  };
  travel_info: {
    title: string;
    description: string;
  };
};

declare type ConferenceDetail = {
  conference_title: string;
  conference_start_date: string;
  conference_end_date: string;
  conference_start_time: string;
  conference_end_time: string;
  conference_location: string;
};

declare type ConferenceDetailResponse = {
  header: ResponseHeader;
  response: ConferenceDetail;
};

declare type GlobalVenueResponse = {
  header: ResponseHeader;
  response: GlobalVenue;
};

declare type Category_Label = {
  name: string;
  id: string;
};

declare type carusole = {
  session_id: string;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
};

declare type SpeakerSetting = {
  carusole_display: carusole[];
  conference_title: string;
  conference_start_date: string;
  conference_end_date: string;
  conference_start_time: string;
  conference_end_time: string;
  conference_location: string;
  speaker_info: {
    exhibitors_setting: boolean;
    show_bio: boolean;
    show_carusole: boolean;
    show_home_title: boolean;
    show_linkedin_badge: boolean;
    show_no_of_sessions: boolean;
    show_short_name: boolean;
    show_speaker_fullname: boolean;
  };
  category_filter: boolean;
  category_labels: string[];
  exhibitor_settings: {
    allow_email_exposure: boolean;
    booth_location: boolean;
    exhibitors_category_list: string[];
    open_link_new_tab: boolean;
  };
};

declare type SpeakerSettingResponse = {
  header: ResponseHeader;
  response: SpeakerSetting;
};

declare type Programme = {
  id: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  speakers: {
    speaker_id: string;
    fullname: string;
    designation: string;
    company: string;
    bio: string;
    external_link: string;
    keyNote: boolean;
  }[];
  categories: Record<string, Record<string, string>>;
  external_link: string;
  description: string;
  bg_img: string;
};

// declare type Programme = {
//   title: string;
//   categories: { name: string; color: string }[];
//   location: string;
//   start_time: string;
//   end_time: string;
//   speakers: string[];
//   attachments: string[];
//   external_link: string;
//   description: string;
//   start_date: string;
//   end_date: string;
// };

declare type GlobalProgrammeListResponse = {
  header: ResponseHeader;
  response: {
    // conference_title: string;
    // conference_start_date: string;
    // conference_end_date: string;
    // conference_start_time: sring;
    // conference_end_time: string;
    // conference_location: string;
    // programme: {
    //   [date: string]: Programme[];
    // };
    // seq: string[];
    programme: Programme[];
    all_categories: {
      id: string;
      name: string;
      color: string;
    }[];
  };
};

declare type ProgrammeCreateCategoryResponse = {
  header: ResponseHeader;
  response: {
    id: string;
    name: string;
    color: string;
  };
};

declare type ProfileResponse = {
  header: ResponseHeader;
  response: {
    user_info: {
      firstname: string;
      lastname: string;
      email: string;
      designation: string;
      company_name: string;
      linkedin_url: string;
      phone_number: string;
      profile_image: string;
    };
    qr_image: string;
  };
};

declare type ProfilePicResponse = {
  header: ResponseHeader;
  response: {};
};

declare type ProfileUpdateRequest = {
  name_prefix: string;
  firstname: string;
  lastname: string;
  gender: string;
  company_name: string;
  designation: string;
  linkedin_url: string;
  // user_image: string;
  phone_number: string;
};

declare type OtpResponse = {
  header: ResponseHeader;
  response: {
    access_token: string;
    firstname: string;
    lastname: string;
    grp: number;
  };
};

declare type ResendResponse = {
  header: ResponseHeader;
  response: {
    email: string;
    resend_attempt: number;
    message: string;
  };
};

declare type LogoUpdateResponse = {
  header: ResponseHeader;
  response: {
    logo: {
      url: string;
      name: string;
    };
  };
};

declare type Exhibitor = {
  id: string;
  full_name: string;
  url: string;
  email: string;
  logo: string;
  categoryId: string;
  ads: boolean;
};

declare type ExhibitorListResponse = {
  header: ResponseHeader;
  response: {
    seq: string[];
  } & {
    [category: string]: Exhibitor[];
  };
};

declare type Category = {
  id: string;
  name: string;
  color: string;
  type: number;
};

declare type CategoryListResponse = {
  header: ResponseHeader;
  response: Category[];
};

declare type GlobalExhibitorListResponse = {
  header: ResponseHeader;
  response: {
    seq: string[];
  } & {
    [category: string]: Omit<Exhibitor, "category">[];
  };
};

declare type GlobalUsersProfile = {
  header: ResponseHeader;
  response: {
    firstname: string;
    lastname: string;
    email: string;
    designation: string;
    company_name: string;
    linkedin_url: string;
    phone_number: string;
    profile_image: string;
  };
};

declare type Floor_Plan_Response = {
  header: ResponseHeader;
  response: {
    floor_plan: string;
  };
};

declare type Global_Floor_Plan_Response = {
  header: ResponseHeader;
  response: {
    floor_plan: string;
    floor_map_list: Shape[];
  };
};
