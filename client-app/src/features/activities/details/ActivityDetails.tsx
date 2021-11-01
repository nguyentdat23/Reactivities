import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedHeader from "./ActivitiyDetailedHeader";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailededInfo from "./ActivityDetailedInfo";
import ActivityDetailedSideBar from "./ActivityDetailedSidebar";

export default observer(function ActivityDetaileds() {
  const { activityStore } = useStore();

  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
    clearSelectedActivity
  } = activityStore;

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadActivity(id);
    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity]);

  if (loadingInitial || !activity) return <LoadingComponent></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailededInfo activity={activity} />
        <ActivityDetailedChat activityId={activity.id} />
      </Grid.Column>
      <Grid.Column width="6">
        {activity.attendees && <ActivityDetailedSideBar activity={activity} attendees={activity.attendees} />}
      </Grid.Column>
    </Grid>
  );
});
