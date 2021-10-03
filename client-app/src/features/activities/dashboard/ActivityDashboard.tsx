import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivitiesList from "./ActivitiesList";

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { selectedActivity, editMode } = activityStore;
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivitiesList />
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && <ActivityDetails></ActivityDetails>}
        {editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
});
