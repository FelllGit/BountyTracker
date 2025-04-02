export type PlatformData<T extends Record<string, string>> = {
  name: T[keyof T];
  data: {
    date: string;
    value: number;
  }[];
};

export type SecurityContestData<T extends Record<string, string>> = {
  data: {
    name: T[keyof T];
    data: {
      date: string;
      value: number;
    }[];
  };
  total: number;
};
