import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tab, Grid, Header, Button, Form } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';

interface Props {
    profile: Profile;
}

export default observer(function ProfileAbout({ profile }: Props) {
    const { profileStore: { isCurrentUser, loading, updateProfile } } = useStore();

    const [editMode, setEditMode] = useState(false);
    function handleFormSubmit(profile: Profile) {
        console.log(profile);
        updateProfile(profile).then(() => {
            setEditMode(false);
        });
    }

    const validationSchema = Yup.object({
        displayName: Yup.string().required("Display name is required").nullable(),
        bio: Yup.string().nullable(),
    });
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='info' content={`About ${profile.displayName}`}></Header>
                    {isCurrentUser && !editMode && (
                        <Button color='orange' floated='right' onClick={() => setEditMode(!editMode)} basic content='Update Profile'></Button>
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ?
                        <Formik
                            initialValues={profile}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleFormSubmit(values)}>
                            {({ isValid, isSubmitting, dirty, handleSubmit }) =>
                                <Form
                                    className="ui form"
                                    onSubmit={handleSubmit}
                                    autoComplete="off">
                                    <MyTextInput placeholder='Display Name' name={"displayName"} ></MyTextInput>
                                    <MyTextArea placeholder='Bio' name={"bio"} rows={4} ></MyTextArea>
                                    <Button
                                        floated="right"
                                        positive
                                        disabled={!isValid || !dirty}
                                        type="submit"
                                        content="Confirm"
                                        loading={loading || isSubmitting} />
                                    <Button
                                        floated="right"
                                        content="Cancel"
                                        onClick={() => setEditMode(false)}
                                        disabled={isSubmitting} />
                                </Form>}
                        </Formik> :
                        <>
                            <p style={{whiteSpace:'pre-line'}}>{profile.bio}</p>
                        </>}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})