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

function App() {
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
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
