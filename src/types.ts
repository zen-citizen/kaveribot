export type FormEvent = {
  error: any;
  response: any;
  loading: boolean;
  errorMsg: string;
  abortRequest: () => void;
};
