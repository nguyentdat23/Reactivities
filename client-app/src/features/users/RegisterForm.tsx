import { ErrorMessage, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Form, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';

export default observer(function RegisterForm() {
    const { accountStore } = useStore();

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required"),
        confirmPassword: Yup.string().required("Confirm password required").oneOf([Yup.ref('password'), null], "Confirm password must match"),
    });

    return (
        <Formik initialValues={{ username: "", email: "",displayName: "", password: "", confirmPassword: "", error: null }}
            onSubmit={(values, { setErrors }) => accountStore.register(values).catch((error) => 
                 setErrors({ error: error })
            
            )
            }
            validationSchema={validationSchema}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Register account' color='teal' />
                    <MyTextInput name='username' placeholder="UserName"></MyTextInput>
                    <MyTextInput name='email' placeholder="Email"></MyTextInput>
                    <MyTextInput name='displayName' placeholder="DisplayName"></MyTextInput>
                    <MyTextInput name='password' placeholder="Password" type='password'></MyTextInput>
                    <MyTextInput name='confirmPassword' placeholder="Verify Password" type='password'></MyTextInput>
                    <ErrorMessage name='error' render={() =>
                        <Label content={errors.error} style={{ marginBottom: 10 }} basic color='red' />}
                    />
                    <Button loading={isSubmitting} content="Login" positive type='submit' fluid></Button>
                </Form>
            )}

        </Formik >
    )
})
