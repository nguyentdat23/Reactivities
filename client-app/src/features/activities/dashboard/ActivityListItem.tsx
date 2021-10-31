import { format } from "date-fns/esm";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
  const { accountStore: { user } } = useStore();
  return (
    <Segment.Group>

      <Segment>
        {activity.isCancelled ?
          <Label ribbon content="Cancelled" color='red'></Label> :
          <Label ribbon content="Activating" color='green'></Label>}
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={activity.host?.image || "/assets/user.png"}
              style={{ marginBottom: 4 }}
            ></Item.Image>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description> {user?.username === activity.host?.username ? <Label color='orange' basic>Hosted by you</Label> : <>Hosted by <Link to={`/profile/${activity.host?.username}`}>{activity.host?.displayName}</Link></>}</Item.Description>

            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date!, "MMM dd, yyyy HH:mm")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          floated="right"
          content="View"
        ></Button>
      </Segment>
    </Segment.Group>
  );
}
