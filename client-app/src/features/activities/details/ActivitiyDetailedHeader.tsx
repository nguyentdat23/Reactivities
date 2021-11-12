import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Button, Header, Item, Segment, Image } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
  const { activityStore: { updateAttendance, loading, cancelActivityToggle } } = useStore();
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                {/* <p>{format(activity.date!, "MMM dd, yyyy")}</p> */}
                {/* <p>{activity.date}</p> */}
                <p>
                  Hosted by {activity.host?.username}
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {!activity.isHost && activity.isGoing ?
          <Button onClick={updateAttendance} loading={loading}>Cancel Attendance</Button> :
          !activity.isHost && !activity.isGoing ? <Button onClick={updateAttendance} loading={loading} color="teal">Join Activity</Button> :
            activity.isHost && activity.isCancelled ?
              <Button onClick={cancelActivityToggle} color='green' loading={loading}>Activate Activity</Button> :
              <Button onClick={cancelActivityToggle} loading={loading}>Cancel Activity</Button>}
        {activity.isHost &&
          <>
            <Button as={Link} to={`/manage/${activity.id}`} color="orange" floated="right">
              Manage Event
            </Button>
          </>
        }
      </Segment>
    </Segment.Group>
  );
});
