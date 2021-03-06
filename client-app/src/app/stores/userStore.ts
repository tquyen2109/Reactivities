import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
    @observable user: IUser | null = null;
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
      }
    @computed get isLoggedIn() {return !!this.user}
    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
                this.rootStore.activityStore.activityRegistry.clear();
            })          
            this.rootStore.commonStore.setToken(user.token);
            history.push('/activities')
            this.rootStore.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }
    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (error) {
            throw error;
        }
    }
    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
        }
    }
    @action logout = () => {
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
    }
}