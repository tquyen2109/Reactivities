import React, {Fragment} from "react";
import { Container } from "semantic-ui-react";
import "./style.css";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/dashboard/ActivityDetails";
const App: React.FC<RouteComponentProps> = ({location}) => {
 
  return (
    <Fragment>
      <Route exact path='/' component={HomePage}/>
      <Route path={'/(.+)'} render={() => (
        <Fragment>
        <NavBar />
        <Container style={{ marginTop: "7em" }}>        
          <Route exact path='/activities' component={ActivityDashboard}/>
          <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
          <Route path='/activities/:id' component={ActivityDetails}/>
        </Container>
        </Fragment>      
      )}/>
      
    </Fragment>
  );
};

export default withRouter(observer(App));
