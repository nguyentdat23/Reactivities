import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMeta,
  Image,
} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default function ActivityDefault() {
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    openForm,
    cancelSelectedActivity,
  } = activityStore;
  if (!activity) return <LoadingComponent />;
  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`}></Image>
      <CardContent>
        <CardHeader>{activity.title}</CardHeader>
        <CardMeta>
          <span>{activity.date}</span>
        </CardMeta>
        <CardDescription>{activity.description}</CardDescription>
      </CardContent>

      <CardContent extra>
        <ButtonGroup widths="6">
          <Button
            onClick={() => openForm(activity.id)}
            basic
            color="blue"
            content="Edit"
          ></Button>
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={cancelSelectedActivity}
          ></Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}
