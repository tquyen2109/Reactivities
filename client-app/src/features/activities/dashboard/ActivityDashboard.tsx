import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import  ActivityStore  from "../../../app/stores/activityStore";
import  ActivityList  from "./ActivityList";

const ActivityDashboard: React.FC= () => {
  const activityStore = useContext(ActivityStore);
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if(activityStore.loadingInitial) return <LoadingComponent content="Loading activities..."/>;
  //ensure use effect run one time only with second parameter
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList/>
      </Grid.Column>
      <h2>Activity filters</h2>
    </Grid>
  );
};

export default observer(ActivityDashboard);
