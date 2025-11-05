declare type ModelSliceType = {
  loginModel: boolean;
};

declare type HomeDesignStateType = {
  selected: string | null;
  isDeleting: string | null;
  isPublished: string | null;
  isCreating: boolean
  news: News[]
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
  speakers: string;
  attachments: File[];
  external_link: string;
  description: string;
  created_on: string;
}

declare type CreateSessionRequest = Omit<Session, "sno"|"session_id"|"created_on">;

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
  response: (CreateSpeakerRequest & { speaker_id: string, created_on:string })[];
};

declare type DeleteSpeakerResponse = {
  header: ResponseHeader;
  response: {
    speaker_id: string;
  };
};