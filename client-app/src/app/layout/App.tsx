import "./style.css";
import { Container, Modal } from "semantic-ui-react";
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
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modal/ModalContainer";

function App() {
  const { accountStore, commonStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      accountStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore])
  
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
                {accountStore.user && <>
                  <Route
                    exact
                    path="/activities"
                    component={ActivityDashboard}
                  ></Route>
                  <Route path="/activities/:id" component={ActivityDetails}></Route>
                  <Route
                    path={["/createActivity", "/editActivity/:id"]}
                    component={ActivityForm}
                  ></Route>
                  <Route path="/manage/:id" component={ActivityForm}></Route>
                </>}
                <Route path="/login" component={LoginForm}></Route>
                <Route path="/errors" component={TestErrors}></Route>
                <Route path="/server-error" component={ServerError}></Route>
                <Route path="" component={NotFound}></Route>
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
