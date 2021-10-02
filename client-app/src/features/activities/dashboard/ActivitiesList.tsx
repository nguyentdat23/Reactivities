import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activities: Activity[];
  submitting: boolean;
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}
export default function ActivitiesList({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
}: Props) {
  const [target, setTarget] = useState<string>();
  function handleDeleteActivity(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    deleteActivity(id);
    setTarget(e.currentTarget.name);
  }
  return (
    <Segment>
      <Item.Group>
        {activities.map((activity) => (
          <Item key={activity.id}>
            {/* if(submitting) return <LoadingComponent></LoadingComponent> */}
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  onClick={() => selectActivity(activity.id)}
                />
                <Button
                  name={activity.id}
                  floated="right"
                  content="Delete"
                  color="red"
                  loading={submitting && target === activity.id}
                  onClick={(event) => handleDeleteActivity(event, activity.id)}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}
