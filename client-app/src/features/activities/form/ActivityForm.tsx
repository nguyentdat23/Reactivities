import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Button,
  Header,
  Segment,
} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { ActivityFormValue } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOtions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const history = useHistory();

  const {
    selectedActivity,
    createActivity,
    updateActivity,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if(id) loadActivity(id).then(activity => setActivity(new ActivityFormValue(activity)));
  }, [loadActivity, id, selectedActivity]);

  const [activity, setActivity] = useState<ActivityFormValue>(new ActivityFormValue());

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required.'),
    description: Yup.string().required('The activity description is required.'),
    date: Yup.date().required("Date is required").nullable(),
    category: Yup.string().required('The activity category is required.'),
    venue: Yup.string().required('The activity venue is required.'),
    city: Yup.string().required('The activity city is required.'),
  })

  Yup.date().typeError("Date is required");

  function handleFormSubmit(activity: ActivityFormValue) {
    console.log(typeof activity);
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
      <Header content='Activity Details' color='teal' />
      <Formik
        enableReinitialize
        initialValues={activity}
        validationSchema={validationSchema}
        onSubmit={values => handleFormSubmit(values)}>
        {({ isValid, isSubmitting, dirty, handleSubmit }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name='title' placeholder='Title'></MyTextInput>
            <MyTextArea
              placeholder="Description"
              name="description" rows={3}></MyTextArea>
            <MySelectInput
              placeholder='Category'
              options={categoryOptions} name='category'></MySelectInput>
            <MyDateInput
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMM dd, yyyy HH:mm'
            />
            <Header content='Location Details' color='teal' />
            <MyTextInput
              placeholder="City"
              name="city"
            ></MyTextInput>
            <MyTextInput
              placeholder="Venue"
              name="venue"
            ></MyTextInput>
            <Button
              floated="right"
              positive
              disabled={isSubmitting || !dirty || !isValid}
              type="submit"
              content="Confirm"
              loading={isSubmitting} />
            <Button
              floated="right"
              as={Link}
              to={id ? `/activities/${id}` : "/activities"}
              type="button"
              content="Cancel" />
          </Form>
        )}
      </Formik >

    </Segment>
  );
});
