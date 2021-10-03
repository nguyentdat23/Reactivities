import "./style.css";
import { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { Route } from "react-router";
import HomePage from "../../features/home/Home";
import ActivityForm from "../../features/activities/form/ActivityForm";

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadingActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent></LoadingComponent>;
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "5em" }}>
        <Route path="/" component={HomePage}></Route>
        <Route path="/activity" component={ActivityDashboard}></Route>
        <Route path="/createActivity" component={ActivityForm}></Route>
      </Container>
    </Fragment>
  );
}

export default observer(App);
