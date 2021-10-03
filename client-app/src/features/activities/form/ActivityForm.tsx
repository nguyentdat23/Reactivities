import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import {
  Button,
  Form,
  FormInput,
  FormTextArea,
  Segment,
} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    selectedActivity,
    closeForm,
    createActivity,
    updateActivity,
    loading,
  } = activityStore;
  let initialState = selectedActivity ?? {
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
    setActivity({ ...activity, [name]: value });
  }
  function handleSubmit() {
    activity.id ? updateActivity(activity) : createActivity(activity);
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
          type="date"
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
        <Button
          floated="right"
          positive
          type="submit"
          content="Confirm"
          loading={loading}
        />
        <Button
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
});
