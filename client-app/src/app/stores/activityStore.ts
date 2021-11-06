import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValue } from "../models/activity";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set('all', true);

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activityRegistry.clear();
        this.loadingActivities();
      }
    )
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  }

  setPredicate = (predicate: string, value: string | Date) => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== 'startDate') this.predicate.delete(key);
      });
    }
    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('all', true);
        break;
      case 'isGoing':
        resetPredicate();
        this.predicate.set('isGoing', true);
        break;
      case 'isHost':
        resetPredicate();
        this.predicate.set('isHost', true);
        break;
      case 'startDate':
        this.predicate.delete('startDate');
        this.predicate.set('startDate', value);
        break;
    }
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    this.predicate.forEach((v, k) => {
      if (k === 'startDate') {
        params.append(k, (v as Date).toISOString());
      } else {
        params.append(k, v);
      }
    })
    return params;
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => {
      return a.date!.getTime() - b.date!.getTime();
    });
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date, "MMM dd, yyyy");
        if (activities[date]) {
          activities[date] = [...activities[date], activity];
        } else {
          activities[date] = [activity];
        }
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  };

  loadingActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Activities.list(this.axiosParams);
      runInAction(() => {
        console.log(result);
        if (result) {
          result.data.forEach((activity: Activity) => {
            this.setActivity(activity);
          });
          this.setPagination(result.pagination);
          this.setLoadingInitial(false);
        }

      });
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.setLoadingInitial(false);
      });
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  }

  loadActivity = async (id: string) => {
    if (id) {
      let activity = this.getActivity(id);
      if (activity) {
        this.selectedActivity = activity;
        return activity;
      } else {
        this.setLoadingInitial(true);
        try {
          const activity = await agent.Activities.details(id);
          if (activity) {
            this.selectedActivity = activity;
            this.setActivity(activity);
            this.setLoadingInitial(false);
            return activity;
          }

        } catch (error) {
          console.log(error);
          this.setLoadingInitial(false);
        }
      }
    } else {
      this.selectedActivity = undefined;
    }
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = async (activity: Activity) => {
    const user = store.accountStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        a => a.username === user.username
      )
      activity.isHost = activity.hostUserName === user.username;
      activity.host = activity.attendees?.find(x => x.username === activity.hostUserName);
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: ActivityFormValue) => {
    const user = store.accountStore.user;
    const attendees = new Profile(user!);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.attendees = [attendees];
      newActivity.hostUserName = user!.username;
      this.setActivity(newActivity);
      runInAction(() => {
        this.activityRegistry.set(newActivity.id, newActivity);
        this.selectedActivity = newActivity;
        this.editMode = false;
      });
    } catch (error) {
      console.log(error);
    }
  };
  updateActivity = async (activity: ActivityFormValue) => {
    console.log(activity);
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          const updatedActivity = { ...this.getActivity(activity.id), ...activity };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
        this.editMode = false;
      });
    } catch (err) {
      console.error(err);
    }
  };
  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  updateAttendance = async () => {
    const user = store.accountStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(atd => atd.username !== user?.username);
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loading = false);
    }
  }
  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }
  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach(activity => {
      activity.attendees.forEach(attendee => {
        if (attendee.username === username) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      })
    })
  }
}
