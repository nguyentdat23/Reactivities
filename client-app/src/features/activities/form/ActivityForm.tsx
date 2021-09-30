import { ChangeEvent, useState } from "react";

import {
  Button,
  Form,
  FormInput,
  FormTextArea,
  Segment,
} from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  selectedActivity: Activity | undefined;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
}
export default function ActivityForm({
  selectedActivity,
  closeForm,
  createOrEdit,
}: Props) {
  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  };
  const [activity, setActivity] = useState(initialState);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    console.log(event.target);
    setActivity({ ...activity, [name]: value });
  }
  function handleSubmit() {
    createOrEdit(activity);
  }
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <FormInput
          placeholder="Title"
          name="title"
          value={activity.title}
          onChange={handleInputChange}
        ></FormInput>
        <FormTextArea
          placeholder="Description"
          name="description"
          value={activity.description}
          onChange={handleInputChange}
        ></FormTextArea>
        <FormInput
          placeholder="Category"
          name="category"
          value={activity.category}
          onChange={handleInputChange}
        ></FormInput>
        <FormInput
          placeholder="Date"
          name="date"
          value={activity.date}
          onChange={handleInputChange}
        ></FormInput>
        <FormInput
          placeholder="City"
          name="city"
          value={activity.city}
          onChange={handleInputChange}
        ></FormInput>
        <FormInput
          placeholder="Venue"
          name="venue"
          value={activity.venue}
          onChange={handleInputChange}
        ></FormInput>
        <Button floated="right" positive type="submit" content="Confirm" />
        <Button
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
}
