import { observer } from "mobx-react-lite";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";


export default observer(

    function ProfileFollowing() {
        const { profileStore } = useStore();
        const { profile, followList, loadingFollowings, activeTab } = profileStore;
        
        return (
            <Tab.Pane loading={loadingFollowings}>
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