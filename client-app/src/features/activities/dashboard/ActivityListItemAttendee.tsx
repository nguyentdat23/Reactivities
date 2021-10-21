import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Image, Label, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";

interface Props {
    attendees: Profile[] | undefined;
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees && attendees.map(attendee =>
                <Popup size='small' trigger={
                    <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`} >
                        <Image size='mini' circular src={attendee.image || '/assets/user.png'} />
                    </List.Item>}>
                    <Card fluid>
                        <Image size="small" src={attendee.image || '/assets/user.png'} />
                        <Card.Content>
                            <Card.Header content={attendee.displayName} />
                            <Card.Meta content={attendee.username} />
                            <Card.Description content={attendee.bio} />
                        </Card.Content>
                    </Card>
                </Popup>

            )}
        </List>
    )
})