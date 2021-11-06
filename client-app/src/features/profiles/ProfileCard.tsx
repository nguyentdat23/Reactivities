import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import FollowButton from "./FollowButton";

interface Props {
    attendee: Profile | null;
}
export default observer(function ProfileCard({ attendee }: Props) {
    return (attendee &&
        <Card as={Link} to={`/profile/${attendee.username}`}>
            <Image wrapped src={attendee.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header content={attendee.displayName} />
                <Card.Meta content={attendee.username} />
                <Card.Description className='truncate' content={attendee.bio} />
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {attendee.followersCount} followers
            </Card.Content>
            <FollowButton profile={attendee} />
        </Card>
    )
})