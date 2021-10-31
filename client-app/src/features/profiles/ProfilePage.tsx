import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default observer(function ProfilePage() {
    const { profileStore } = useStore();
    const { username } = useParams<{ username: string }>();
    const { loadingProfile, loadProfile, profile } = profileStore;
    useEffect(() => {
        loadProfile(username);
    }, [loadProfile, username]);

    if (loadingProfile) return <LoadingComponent></LoadingComponent>

    return (
        <Grid>
            <Grid.Column>
                {profile &&
                    <>
                        <ProfileHeader profile={profile}></ProfileHeader>
                        <ProfileContent profile={profile}></ProfileContent>
                    </>}
            </Grid.Column>
        </Grid>
    )
})