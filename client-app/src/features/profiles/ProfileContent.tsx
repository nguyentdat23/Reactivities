import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { store } from "../../app/stores/store";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowing from "./ProfileFollowing";
import ProfilePhoto from "./ProfilePhoto";


interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout profile={profile}>About Content</ProfileAbout> },
        { menuItem: 'Photo', render: () => <ProfilePhoto profile={profile}></ProfilePhoto> },
        { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <ProfileFollowing /> },
        { menuItem: 'Following', render: () => <ProfileFollowing /> }
    ];
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => store.profileStore.setActiveTab(data.activeIndex)}
        />
    )
})