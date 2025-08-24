export type ServiceReturn<T> = {
  status: "success" | "error";
  data: T | null;
  error?: string | null;
  statusCode : number
};
