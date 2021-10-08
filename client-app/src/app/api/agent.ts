import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity } from '../models/activity';
import { store } from '../stores/store';

const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};
axios.defaults.baseURL = 'https://localhost:5001/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
const responseBody = <T>(response: AxiosResponse<T>) => response.data;
axios.interceptors.response.use(
	async (res) => {
		return res;
	},
	(err: AxiosError) => {
		const { data, status: statusCode, config } = err.response!;
		switch (statusCode) {
			case 404:
				history.push('/notfound');
				break;
			case 400:
				// if(typeof data === 'string'){
				// 	toast.error(data);
				// }
				console.log(data, config);
				if (data.errors) {
					const modalStateError = [];
					for (const key in data.errors) {
						if (data.errors[key]) modalStateError.push(data.errors[key]);
					}
					throw modalStateError.flat();
				} else {
					toast.error(data);
				}

				if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
					history.push('/notfound');
				}
				break;
			case 500:
				store.commonStore.setServerError(data);
				history.push('/server-error');
				break;
		}
	}
);
const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody),
	post: <T>(url: string, activity: Activity) =>
		axios
			.post<T>(url, activity, {
				headers: { 'Content-Type': 'application/json' }
			})
			.then(responseBody),
	put: <T>(url: string, activity: Activity) =>
		axios
			.put<T>(url, activity, {
				headers: { 'Content-Type': 'application/json' }
			})
			.then(responseBody),
	del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
	list: () => requests.get<Activity[]>('activities'),
	details: (id: string) => requests.get<Activity>(`activities/${id}`),
	create: (activity: Activity) => requests.post<void>('activities', activity),
	update: (activity: Activity) => requests.put<void>(`activities/${activity.id}`, activity),
	delete: (id: string) => requests.del<void>(`activities/${id}`)
};
const agent = {
	Activities
};
export default agent;
