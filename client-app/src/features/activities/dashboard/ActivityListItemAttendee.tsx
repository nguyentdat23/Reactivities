import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[] | undefined;
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees && attendees.map(attendee =>
                <Popup size='tiny' key={attendee.username} trigger={
                    <List.Item key={attendee.username} as={Link} to={`/profile/${attendee.username}`} >
                        <Image size='mini' circular src={attendee.image || '/assets/user.png'} />
                    </List.Item>}>
                    <ProfileCard attendee={attendee} />
                </Popup>
            )}
        </List>
    )
})