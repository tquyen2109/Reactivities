import { action, makeObservable, observable, runInAction, computed} from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile, IUserActivity } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        // reaction(
        //     () => this.activeTab,
        //     activeTab => {
        //         if(activeTab === 3 || activeTab === 4)
        //         {
        //             const predicate = activeTab === 3 ? 'follower' : 'following';
        //             this.loadFollowings(predicate);
        //         }
        //         else {
        //             this.followings = [];
        //         }
        //     }
        // )
        makeObservable(this);
    }
    @observable profile : IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;
    @observable userActivities: IUserActivity[] = []
    @observable loadingActivities = false;
    @computed get isCurrentUser() {
        if(this.rootStore.userStore.user && this.profile)
        {
            return this.rootStore.userStore.user.username === this.profile.username;
        }
        else{
            return false;
        }
    }
    @action loadUserActivities = async(username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const activities = await agent.Profile.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        } catch (error) {
            toast.error('Problem loading activities');
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }
    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
        if(this.activeTab === 3 || this.activeTab === 4)
                {
                    const predicate = this.activeTab === 3 ? 'follower' : 'following';
                    this.loadFollowings(predicate);
                }
                else {
                    this.followings = [];
                }
    }
    @action loadProfile =  async (username: string) => {
        this.loadingProfile = true;
        try {
             const profile = await agent.Profile.get(username);
             runInAction(() => {
                 this.profile = profile;
                 this.loadingProfile = false;
             })   
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }
    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profile.uploadPhoto(file);
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto)  => {
        this.loading = true;
        try {
            await agent.Profile.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem setting photo as main');
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profile.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem deleting the photo')
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    @action updateProfile = async (profile: IProfile) => {
        this.loading = true;
        try {
            if(!profile.bio)
            {
                profile.bio = "";
            }
            await agent.Profile.updateProfile(profile);
            runInAction(() => {
                this.profile!.displayName = profile.displayName;
                this.profile!.bio = profile.bio;
                this.rootStore.userStore.user!.displayName = profile.displayName;
                this.loading=false;
            })
        } catch (error) {
             toast.error('Problem updating the profile');
             console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    @action follow = async (username: string) =>
    {
        this.loading = true;
        try {
            await agent.Profile.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            }) 
        } catch (error) {
            toast.error('Problem following user');
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    @action unfollow = async (username: string) =>
    {
        this.loading = true;
        try {
            await agent.Profile.unfollow(username);
            runInAction(() => {
                this.profile!.following = false
                this.profile!.followersCount--;
                this.loading = false;
            }) 
        } catch (error) {
            toast.error('Problem unfollowing user');
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    @action loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profile.listFollowing(this.profile!.username, predicate)
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem loading followings');
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}