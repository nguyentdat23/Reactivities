import React from "react";
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
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
  cancelSelectActivity: () => void;
  openForm: (id: string) => void;
}
export default function ActivityDefault({
  activity,
  cancelSelectActivity,
  openForm,
}: Props) {
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
          <Button onClick={() => openForm(activity.id)} basic color="blue" content="Edit"></Button>
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={cancelSelectActivity}
          ></Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}
