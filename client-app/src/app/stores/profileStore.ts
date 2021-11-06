import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, UserEvent } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    followList: Profile[] = [];
    events: UserEvent[] = [];
    loadingProfile = false;
    loadingFollowings = false;
    uploading = false;
    isSubmitting = false;
    loading = false;
    deleting = false;
    activeTab = 0;
    predicate: string = 'future';

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'follower' : 'following';
                    this.loadFollowings(predicate);
                }
                else {
                    this.followList = [];
                }
            }
        );

        reaction(
            () => this.predicate,
            () => {
                this.events = [];
                this.loadEvents();
            }
        )
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('predicate', this.predicate);
        return params;
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    setPredicate = (predicate: string) => {
        this.predicate = predicate;
    }

    get isCurrentUser() {
        if (store.accountStore.user && this.profile) {
            return store.accountStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            const events = await agent.Profiles.getEvents(username, this.axiosParams);
            runInAction(() => {
                if (profile)
                    this.profile = profile;
                if (events)
                    this.events = events;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const respone = await agent.Profiles.uploadPhoto(file);
            const photo = respone.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos!.push(photo);
                    if (photo.isMain && store.accountStore.user) {
                        store.accountStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id).then(() => {
                store.accountStore.setImage(photo.url);
            });
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (id: string) => {
        this.deleting = true;
        try {
            await agent.Profiles.deletePhoto(id);
            runInAction(() => {
                this.profile!.photos = this.profile?.photos?.filter(p => p.id !== id);
                this.deleting = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.deleting = false);
        }
    }

    updateProfile = async (profile: Profile) => {
        this.isSubmitting = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                this.profile!.bio = profile.bio;
                this.profile!.displayName = profile.displayName;
                store.accountStore.user!.displayName = profile.displayName;
                this.isSubmitting = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.isSubmitting = false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        const currentUser = store.accountStore.user;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            const currentProfile = await agent.Profiles.get(currentUser!.username);
            runInAction(() => {
                if (this.profile && (this.profile?.username === username || this.profile?.username === currentUser?.username)) {
                    if (following) {
                        if (this.profile?.username !== currentUser?.username) {
                            // on someone profile, add my profile to followers list on follow event 
                            // if only we're on followers list 

                            if (this.activeTab === 3 && currentProfile) this.followList.push(currentProfile);
                            this.profile.followersCount++;
                        } else {
                            this.profile.followingCount++;
                        }
                    } else {
                        if (this.profile?.username !== currentUser?.username) {
                            // on someone's profile, remove my profile from followers list on unfollow event
                            // if only we're on followers list 
                            if (this.activeTab === 3 && currentProfile) this.followList = this.followList.filter(profile => profile.username !== currentProfile.username);
                            this.profile.followersCount--;
                        } else {
                            this.profile.followingCount--;
                            // on my profile page, remove profile from following list on unfollow event 
                            // if only we're on following list
                            if (this.activeTab === 4) this.followList = this.followList.filter(profile => profile.username !== username);
                        }
                    }
                    this.profile.following = !this.profile.following;
                }
                this.loading = false;
                this.followList.forEach(profile => {
                    if (profile.username === username) {
                        profile.following = !profile.following;
                        if (following) {
                            profile.followersCount++;
                        } else {
                            profile.followersCount--;
                        }
                    }
                })
            })
        } catch (error) {
            console.log(error);
            runInAction(() =>
                this.loading = false
            );
        }
    }
    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            if (this.profile) {
                const followings = await agent.Profiles.listFollowing(this.profile?.username, predicate);

                runInAction(() => {
                    if (followings)
                        this.followList = followings;


                    this.loadingFollowings = false;
                });
            }
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }

    loadEvents = async () => {
        this.loading = true;
        try {
            if (this.profile) {
                const events = await agent.Profiles.getEvents(this.profile.username, this.axiosParams);
                runInAction(() => {
                    if (events) {
                        this.events = events;
                    }
                    this.loading = false;
                })
            };
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }
}