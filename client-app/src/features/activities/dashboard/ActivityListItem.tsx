import { format } from "date-fns/esm";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
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
              src="/assets/user.png"
              style={{marginBottom: 4}}
            ></Item.Image>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by {activity.host?.username}</Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color='orange' content='You are hosting this activity'></Label>
                </Item.Description>
              )}
              {/* {activity.isHost && activity.isGoing && (
                <Item.Description>
                  <Label basic color='green' content='You are going to this activity' />
                </Item.Description>
              )} */}
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
