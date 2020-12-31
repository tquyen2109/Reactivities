import React from "react";
import { Tab } from "semantic-ui-react";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowing";
import ProfilePhotos from "./ProfilePhotos";

const panes = [
  { menuItem: "About", render: () => <ProfileAbout /> },
  { menuItem: "Photo", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <Tab.Pane>Activities content</Tab.Pane>,
  },
  { menuItem: "Followers", render: () => <ProfileFollowings /> },
  { menuItem: "Following", render: () => <ProfileFollowings /> },
];
interface IProps {
    setActiveTab: (activeIndex: any) => void
}
const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    />
  );
};
export default ProfileContent;
