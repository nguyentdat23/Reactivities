import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivityList() {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;
  return (
    <>
      {groupedActivities.map(([date, activities]) => {
        return (
          <Fragment key={date}>
            <Header sub color="teal">
              {date}
            </Header>
            <Segment>
              <Item.Group>
                {activities.map((activity) => {
                  return (
                    <ActivityListItem key={activity.id} activity={activity} />
                  );
                })}
              </Item.Group>
            </Segment>
          </Fragment>
        );
      })}
    </>
  );
});
