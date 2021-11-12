import { observer } from "mobx-react-lite";
import { Image, Label, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { User } from "../../../app/models/user";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[] | undefined,
    user: User | null
}

export default observer(function ActivityListItemAttendee({ attendees, user }: Props) {
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }
    if (attendees && user) {
        return (
            <List horizontal>
                {attendees && attendees.map(attendee =>
                    <Popup hoverable size='tiny' key={attendee.username} trigger={
                        <Label image >
                            <Image
                                size='mini'
                                circular src={attendee.image || '/assets/user.png'}
                                bordered
                                style={attendee.following ? styles : null}
                            />
                            {attendee.username}
                        </Label>}>
                        <ProfileCard attendee={attendee} />
                    </Popup>
                )}
            </List>
        )
    }
    return <></>;
})