import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivitiesList() {
  const { activityStore } = useStore();
  const { groupedActivities, loadingInitial, loadingActivities } =
    activityStore;

  useEffect(() => {
    if (groupedActivities.length <= 1) loadingActivities();
  });
  if (loadingInitial || !groupedActivities)
    return <LoadingComponent content="Loading activities..."></LoadingComponent>;

  return (
    <>
      {groupedActivities.map(([date, activities]) => {
        return (
          <Fragment key={date}>
            <Header sub color="teal">
              {date}
            </Header>

            {activities.map((activity) => {
              return <ActivityListItem key={activity.id} activity={activity} />;
            })}
          </Fragment>
        );
      })}
    </>
  );
});
