import { Profile } from "./profile";

export interface Activity {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUserName: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees: Profile[];
}

export class Activity implements Activity{
  constructor(init?: ActivityFormValue){
    Object.assign(this, init);
  }
}

export class ActivityFormValue {
  id?: string = undefined;
  title: string = '';
  date: Date | null = null;
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';

  constructor(activity?: ActivityFormValue) {
    if (activity) {
      this.title = activity?.title;
      this.date = activity.date;
      this.id = activity.id;
      this.description = activity.description;
      this.category = activity.category;
      this.venue = activity.venue;
      this.city = activity.city;
    }
  }
}
