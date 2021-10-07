import "./style.css";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route } from "react-router";
import HomePage from "../../features/home/Home";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

function App() {
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
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
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
