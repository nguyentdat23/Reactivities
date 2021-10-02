import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
axios.defaults.baseURL = "https://localhost:5001/api";
axios.defaults.headers.common["Content-Type"] = "application/json";
const responseBody = <T>(response: AxiosResponse<T>) => response.data;
axios.interceptors.response.use(async (res) => {
  try {
    await sleep(1000);
    return res;
  } catch (err) {
    console.log(err);
    return await Promise.reject(err);
  }
});
const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, activity: Activity) =>
    axios
      .post<T>(url, activity, {
        headers: { "Content-Type": "application/json" },
      })
      .then(responseBody),
  put: <T>(url: string, activity: Activity) =>
    axios
      .put<T>(url, activity, {
        headers: { "Content-Type": "application/json" },
      })
      .then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("activities"),
  details: (id: string) => requests.get<Activity>(`activities/${id}`),
  create: (activity: Activity) => requests.post<void>("activities", activity),
  update: (activity: Activity) =>
    requests.put<void>(`activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`activities/${id}`),
};
const agent = {
  Activities,
};
export default agent;
