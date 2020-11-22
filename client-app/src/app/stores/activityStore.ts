import { observable, action, makeObservable, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({enforceActions: 'always'});
export class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";
  constructor() {
    makeObservable(this);
  }

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    )
    return Object.entries(sortedActivities.reduce((activities,activity) => {
      const date = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[]}));
  }
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    console.log(this.groupActivitiesByDate(activities));
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      })
      console.log(error);
      
    }
  };

  @action createActivity = async (activity: IActivity) => {
    
    try {
      this.submitting = true;
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      })
      
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      })    
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {    
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      })
     
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      })      
      console.log(error);
    }
  };

  
  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement> ,id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
        await agent.Activities.delete(id);
        runInAction(() => {
          this.activityRegistry.delete(id);
          this.submitting = false;
          this.target = "";
        })
       
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      })       
        console.log(error);
    }    
  };
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if(activity) {
      this.activity= activity;
    }
    else{
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.detail(id);
        runInAction(() => {
          this.activity = activity;
          this.loadingInitial = false;
        })
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        })
        console.log(error);
      }
    }
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }
  @action clearActivity = () => {
    this.activity = null;
  }
}

export default createContext(new ActivityStore());
