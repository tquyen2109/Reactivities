import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import "./style.css";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/dashboard/ActivityDetails";
const App: React.FC<RouteComponentProps> = ({location}) => {
  const activityStore = useContext(ActivityStore);
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if(activityStore.loadingInitial) return <LoadingComponent content="Loading activities..."/>;
  //ensure use effect run one time only with second parameter
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/activities' component={ActivityDashboard}/>
        <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
        <Route path='/activities/:id' component={ActivityDetails}/>
      </Container>
    </Fragment>
  );
};

export default withRouter(observer(App));
