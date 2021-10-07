import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  FormInput,
  FormTextArea,
  Segment,
} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const history = useHistory();

  const {
    selectedActivity,
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams<{ id: string }>();

  let initialState =
    selectedActivity && id
      ? selectedActivity
      : {
          id: "",
          title: "",
          category: "",
          description: "",
          date: Date(),
          city: "",
          venue: "",
        };

  useEffect(() => {
    loadActivity(id);
    if (selectedActivity) {
      setActivity(selectedActivity);
    } else {
      setActivity({
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      });
    }
  }, [loadActivity, id, selectedActivity]);

  const [activity, setActivity] = useState<Activity>(initialState);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  function handleSubmit() {
    activity.id
      ? updateActivity(activity).then(() => {
          history.push(`/activities/${activity.id}`);
        })
      : createActivity(activity).then(() => {
          history.push(`/activities/${activity.id}`);
        });
  }
  if (id && (!selectedActivity || loadingInitial))
    return <LoadingComponent></LoadingComponent>;
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
          floated="right"
          as={Link}
          to={id ? `/activities/${id}` : "/activities"}
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
});
