import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import { UserEvent } from "../../app/models/profile";

interface Props {
    userEvents: UserEvent[];
}

export default observer(function ProfileListEvents({ userEvents }: Props) {
    return <Card.Group itemsPerRow={3}>
        {userEvents.map(userEvent =>
            <Card as={Link} to={`/activities/${userEvent.id}`} key={userEvent.id}>
                <Image
                    src={`/assets/categoryImages/${userEvent.category}.jpg`}
                />
                <Card.Content extra>
                    <Card.Header>{userEvent.title}</Card.Header>
                    <Card.Description>{userEvent.date}</Card.Description>
                </Card.Content>
            </Card>

        )}
    </Card.Group>
})