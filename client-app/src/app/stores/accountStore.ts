import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserLoginFormValue, UserRegisterFormValue } from "../models/user";
import { store } from "./store";

export default class AccountStore {
    user: User | null = null;
    /**
     *
     */
    constructor() {
        makeAutoObservable(this);
    }
    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserLoginFormValue): Promise<void> => {
        try {
            const user = await agent.Account.login(creds);
            if (user) {
                store.commonStore.setToken(user.token);
                runInAction(() => this.user = user);
                history.push('/activities');
                store.modalStore.closeModal();
            }
        }
        catch (error) {
            throw error;
        }
    }
    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        history.push('/')
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(()=>{
                this.user = user;
            })
        } catch (error) {
            throw error;
        }
    }
    register = async (creds: UserRegisterFormValue) => {
        try {
            const user = await agent.Account.register(creds);
            if (user) {
                store.commonStore.setToken(user.token);
                runInAction(() => this.user = user);
                history.push('/');
                store.modalStore.closeModal();
            }
        }
        catch (error) {
            throw error;
        }
    } 
}