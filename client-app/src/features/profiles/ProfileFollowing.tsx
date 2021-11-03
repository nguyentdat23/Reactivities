import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";


export default observer(

    function ProfileFollowing() {
        const { profileStore } = useStore();
        const { profile, followList, loadingFollowings, activeTab } = profileStore;
        if (loadingFollowings) return <LoadingComponent />
        return (
            <Tab.Pane>
                <Grid>
                    <Grid.Column width={16}>
                        <Header floated='left' icon='user' content={activeTab === 3 ? `People following ${profile?.displayName}` : `People ${profile?.username} is following`} />
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Card.Group
                            itemsPerRow={4}>
                            {followList && followList.map(profile => (
                                <ProfileCard key={profile?.username} attendee={profile}></ProfileCard>
                            ))}
                        </Card.Group>

                    </Grid.Column>
                </Grid>
            </Tab.Pane>
        )
    }
)