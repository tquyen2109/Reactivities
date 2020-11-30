import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";

import { RootStoreContext } from "../../../app/stores/rootStore";
import  ActivityList  from "./ActivityList";

const ActivityDashboard: React.FC= () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial} = rootStore.activityStore;
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if(loadingInitial) return <LoadingComponent content="Loading activities..."/>;
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
