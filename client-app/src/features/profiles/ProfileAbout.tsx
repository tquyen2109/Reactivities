import { FORM_ERROR } from "final-form";
import React, { useContext, useState } from "react";
import { Button, Form, Grid, Header, Tab } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { TextInput } from "../../app/common/form/TextInput";
import { IProfile } from "../../app/models/profile";
import { RootStoreContext } from "../../app/stores/rootStore";
import { combineValidators, isRequired } from "revalidate";
import { observer } from "mobx-react-lite";
const validate = combineValidators({
  displayName: isRequired("Display Name"),
});
const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const {loading, updateProfile, isCurrentUser, profile } = rootStore.profileStore;
  const [editProfileMode, setEditProfileModeMode] = useState(false);
  return (
    <FinalForm
      onSubmit={(values: IProfile) => {
        updateProfile(values).catch((error) => ({
            [FORM_ERROR]: error,
          })).then(() =>setEditProfileModeMode(false)) 
         
      }}
      initialValues={profile}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Tab.Pane>
          <Grid>
            <Grid.Column width={16} style={{ paddingBottom: 30 }}>
              <Header
                floated="left"
                icon="user"
                content={`About ${profile?.displayName}`}
              />
              {isCurrentUser && (
                <Button
                  floated="right"
                  basic
                  content={editProfileMode ? "Cancel" : "Edit Profile"}
                  onClick={() => setEditProfileModeMode(!editProfileMode)}
                />
              )}
            </Grid.Column>
            <Grid.Column width={16}>
              {!editProfileMode ? (
                <p>{profile?.bio}</p>
              ) : (
                <Form onSubmit={handleSubmit} error>
                  <Field
                    name="displayName"
                    component={TextInput}
                    placeholder="Display Name"
                    value={profile?.displayName}
                  />
                  <Field
                    name="bio"
                    component={TextInput}
                    placeholder="Bio"
                    value={profile?.bio}
                  />
                  {submitError && !dirtySinceLastSubmit && (
                    <ErrorMessage
                      error={submitError}
                      text="All field must not be empty"
                    />
                  )}
                  <Button
                    disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                    loading={loading}
                    positive
                    floated="right"
                    color="teal"
                    content="Update Profile"        
                  />
                </Form>
              )}
            </Grid.Column>
          </Grid>
        </Tab.Pane>
      )}
    />
  );
};
export default observer(ProfileAbout);