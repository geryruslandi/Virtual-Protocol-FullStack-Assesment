export type RegisterDTO = {
  username: string;
  password: string;
  name: string;
  gender: string;
  location: string;
  university: string;
  interests: string[];
};

export type LoginDTO = {
  username: string;
  password: string;
};
