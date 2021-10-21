import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValue } from '../models/activity';
import { User, UserLoginFormValue, UserRegisterFormValue } from '../models/user';
import { store } from '../stores/store';

axios.defaults.baseURL = 'https://localhost:5001/api';
const responseBody = <T>(response: AxiosResponse<T>) => {
	return response.data;
}

axios.interceptors.response.use(
	async (res) => {
		return res;
	},
	(err: AxiosError) => {		
		const { data, status: statusCode, config } = err.response!;
		switch (statusCode) {
			case 401:
				toast.error(data);
				throw data;
			case 404:
				history.push('/notfound');
				break;
			case 400:
				console.log(data);
				if (typeof data === 'string') {
					throw data;
				}
				if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
					history.push('/notfound');
				}
				if (data.errors) {
					const modalStateError: { key: string, message: string }[] = [];
					for (const error in data.errors) {
						const key = error[0].toLowerCase() + error.substring(1);
						modalStateError.push({ key: key, message: data.errors[error] });
					}
					throw modalStateError.flat();
				}
				break;
			case 500:
				store.commonStore.setServerError(data);
				history.push('/server-error');
				break;
		}
	}
);
axios.interceptors.request.use(
	config => {
		const token = store.commonStore.token;
		if (token) config.headers.Authorization = `Bearer ${token}`;
		config.headers['Content-Type'] = 'application/json';
		config.timeout = 5000;
		config.timeoutErrorMessage = "Couldn't connect to server!!!";
		return config;
	},err =>{
		console.log(err);
	}
);
const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody),
	post: <T>(url: string, data: {}) =>
		axios
			.post<T>(url, data)
			.then(responseBody),
	put: <T>(url: string, data: {}) =>
		axios
			.put<T>(url, data)
			.then(responseBody),
	del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
	list: () => requests.get<Activity[]>('activities'),
	details: (id: string) => requests.get<Activity>(`activities/${id}`),
	create: (activity: ActivityFormValue) => requests.post<void>('activities', activity),
	update: (activity: ActivityFormValue) => requests.put<void>(`activities/${activity.id}`, activity),
	delete: (id: string) => requests.del<void>(`activities/${id}`),
	attend: (id:string) => requests.post<void>(`activities/${id}/attend`, {})
};

const Account = {
	current: () => requests.get<User>('account'),
	login: (user: UserLoginFormValue) => requests.post<User>('account/login', user),
	register: (user: UserRegisterFormValue) => requests.post<User>('account/register', user)
}
const agent = {
	Activities,
	Account
};
export default agent;
