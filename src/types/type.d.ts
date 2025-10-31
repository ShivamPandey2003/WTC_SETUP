declare type ModelSliceType = {
  loginModel: boolean;
};

declare type HomeDesignStateType = {
  selected: string | null;
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

declare type CreateSessionRequest = {
  title: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string;
  speakers: string;
  external_link: string;
  description: string;
  attachments: File[];
};

declare type SessionListResponse = {
  header: ResponseHeader;
  response: CreateSessionRequest & { id: string }[];
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
  fullname: string;
  designation: string;
  company: string;
  bio: string;
  external_link: string;
  attachments: File[];
};

declare type SpeakerListResponse = {
  header: ResponseHeader;
  response: CreateSpeakerRequest & { id: string }[];
};

declare type DeleteSpeakerResponse = {
  header: ResponseHeader;
  response: {
    speaker_id: string;
  };
};