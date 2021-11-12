import "./style.css";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Switch } from "react-router";
import HomePage from "../../features/home/Home";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modal/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";


function App() {
  const { accountStore, commonStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      accountStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [accountStore, commonStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...'></LoadingComponent>
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>

                <PrivateRoute exact path="/activities" component={ActivityDashboard} />
                <PrivateRoute path="/activities/:id" component={ActivityDetails} />
                <PrivateRoute
                  path={["/createActivity", "/editActivity/:id"]}
                  component={ActivityForm} />
                <PrivateRoute path="/manage/:id" component={ActivityForm}></PrivateRoute>
                <PrivateRoute path='/profile/:username' component={ProfilePage}></PrivateRoute>
                <PrivateRoute path="/errors" component={TestErrors}></PrivateRoute>
                <Route path="/server-error" component={ServerError}></Route>
                <Route component={NotFound}></Route>

              </Switch>

            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
