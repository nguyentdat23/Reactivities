import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name="search">
                    Oops - we've looked everywhere and could not find this.
                </Icon>
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/' primary>Return to homepage.</Button>
            </Segment.Inline>
        </Segment>
    )

}