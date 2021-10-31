import { Card, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props {
    attendee: Profile;
}
export default function ProfileCard({ attendee }: Props) {

    return (
        <Card >
            <Image size="large" src={attendee.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header content={attendee.displayName} />
                <Card.Meta content={attendee.username} />
                <Card.Description size="small" className='truncate' content={attendee.bio} />
            </Card.Content>
        </Card>
    )
}