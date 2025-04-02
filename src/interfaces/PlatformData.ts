export type PlatformData<T extends Record<string, string>> = {
  name: T[keyof T];
  data: {
    date: string;
    value: number;
  }[];
};
