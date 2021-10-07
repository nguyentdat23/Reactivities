import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import ActivitiesList from "./ActivitiesList";
import ActivityFilters from "./ActivityFilters";

export default observer(function ActivityDashboard() {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivitiesList />
      </Grid.Column>
      <Grid.Column width="6" style={{ paddingTop: "6vh" }}>
        <ActivityFilters></ActivityFilters>
      </Grid.Column>
    </Grid>
  );
});
