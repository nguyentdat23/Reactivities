import { triggerAsyncId } from 'async_hooks';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { request } from 'http';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValue } from '../models/activity';
import { PaginatedResult, Pagination } from '../models/pagination';
import { Photo, Profile } from '../models/profile';
import { User, UserLoginFormValue, UserRegisterFormValue } from '../models/user';
import { store } from '../stores/store';

const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay)
	})
}

axios.defaults.baseURL = 'https://localhost:5001/api';

const responseBody = <T>(response: AxiosResponse<T>) => {
	if (response)
		return response.data;
}

axios.interceptors.response.use(
	async (res) => {
		await sleep(600);
		const pagination = res.headers['pagination'];
		if (pagination) {
			res.data = new PaginatedResult(res.data, JSON.parse(pagination));
			return res as AxiosResponse<PaginatedResult<any>>
		}
		return res;
	},
	(err: AxiosError | any) => {
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
		config.timeoutErrorMessage = "requets timeout";
		return config;
	}, err => {
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
	list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params }).then(responseBody),
	details: (id: string) => requests.get<Activity>(`activities/${id}`),
	create: (activity: ActivityFormValue) => requests.post<void>('activities', activity),
	update: (activity: ActivityFormValue) => requests.put<void>(`activities/${activity.id}`, activity),
	delete: (id: string) => requests.del<void>(`activities/${id}`),
	attend: (id: string) => requests.post<void>(`activities/${id}/attend`, {})
};

const Account = {
	current: () => requests.get<User>('account'),
	login: (user: UserLoginFormValue) => requests.post<User>('account/login', user),
	register: (user: UserRegisterFormValue) => requests.post<User>('account/register', user)
}

const Profiles = {
	get: (username: string) => requests.get<Profile>(`/profile/${username}`),
	uploadPhoto: (file: Blob) => {
		let formData = new FormData();
		formData.append('File', file);
		return axios.post<Photo>('photos', formData, {
			headers: { 'Content-type': 'multipart/form-data' }
		})
	},
	setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
	deletePhoto: (id: string) => requests.del(`/photos/${id}`),
	updateProfile: (profile: Profile) => requests.put(`/profile/`, profile),
	updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
	listFollowing: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
	getEvents: (username: string, params: URLSearchParams) => axios.get(`/profile/${username}/activities`, { params }).then(responseBody),
}

const agent = {
	Activities,
	Account,
	Profiles
};
export default agent;
