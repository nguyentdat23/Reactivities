import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";
import { Reveal, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: Profile;
}

export default observer(
    function FollowButton({ profile }: Props) {

        const { profileStore, accountStore } = useStore();
        const { updateFollowing, loading } = profileStore;

        function handleFollow(e: SyntheticEvent, username: string) {
            e.preventDefault();
            profile.following ? updateFollowing(username, false) : updateFollowing(username, true);

        }

        if (accountStore.user?.username === profile.username) return null;

        return (
            <Reveal animated='move'>
                <Reveal.Content visible style={{ width: '100%' }}>
                    <Button
                        fluid
                        color={profile.following ? 'teal' : 'grey'}
                        content={profile.following ? "Following" : "Not following"}></Button>
                </Reveal.Content>

                <Reveal.Content hidden style={{ width: '100%' }}>
                    <Button
                        fluid
                        loading={loading}
                        color={profile.following ? 'red' : 'green'}
                        content={profile.following ? 'Unfollow' : 'Follow'}
                        onClick={e => handleFollow(e, profile.username)}>
                    </Button>
                </Reveal.Content>
            </Reveal>)
    }
)