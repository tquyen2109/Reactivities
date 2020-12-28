import React from 'react'
import {Tab} from 'semantic-ui-react'
import  ProfileAbout  from './ProfileAbout'
import ProfilePhotos from './ProfilePhotos'

const panes = [
    {menuItem: 'About',render: () => <ProfileAbout/>},
    {menuItem: 'Photo',render: () => <ProfilePhotos/>},
    {menuItem: 'Activities',render: () => <Tab.Pane>Activities content</Tab.Pane>},
    {menuItem: 'Followers',render: () => <Tab.Pane>Followers content</Tab.Pane>},
    {menuItem: 'Following',render: () => <Tab.Pane>Following content</Tab.Pane>},
]
const ProfileContent = () => {
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes = {panes}
          
        />
    )
}
export default ProfileContent