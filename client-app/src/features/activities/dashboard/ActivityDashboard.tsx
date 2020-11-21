import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import  ActivityStore  from "../../../app/stores/activityStore";
import  ActivityList  from "./ActivityList";


export const ActivityDashboard: React.FC= () => {
  const activityStore = useContext(ActivityStore);
  const {editMode, activity} = activityStore;
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
