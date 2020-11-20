import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useContext } from "react";
import { Grid } from "semantic-ui-react";
import  ActivityStore  from "../../../app/stores/activityStore";
import  ActivityForm  from "../form/ActivityForm";
import  ActivityDetails  from "./ActivityDetails";
import  ActivityList  from "./ActivityList";


export const ActivityDashboard: React.FC= () => {
  const activityStore = useContext(ActivityStore);
  const {editMode, selectedActivity} = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList/>
      </Grid.Column>

      <Grid.Column width={6}>
        {/* Right side of && only execute when left side is not null */}
        {selectedActivity && !editMode && (
          <ActivityDetails/>
        )}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}       
            activity={selectedActivity!}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
