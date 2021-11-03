import { observer } from "mobx-react-lite";
import { Divider, Grid, Header, Item, Segment, Statistic, Reveal, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import FollowButton from "./FollowButton";

interface Props {
    profile: Profile | null;
}
export default observer(function ProfileHeader({ profile }: Props) {
    const { profileStore: { isCurrentUser }
    } = useStore();
    return (profile &&
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.image || '/assets/user.png'}></Item.Image>
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile?.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column verticalAlign='middle' width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label="Followers" value={profile.followersCount} />
                        <Statistic label="Following" value={profile.followingCount} />
                    </Statistic.Group>

                    {!isCurrentUser &&
                        <>
                            <Divider />
                            <FollowButton profile={profile} />
                        </>
                    }
                </Grid.Column>
            </Grid>
        </Segment>
    )
})