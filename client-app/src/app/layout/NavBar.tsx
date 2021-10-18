import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Header, Image, Label, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer(function NavBar() {
  const { accountStore: { user, logout } } = useStore();

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" exact header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>

        {user && <>
          <Menu.Item as={NavLink} to="/activities" name="Activities"></Menu.Item>
          <Menu.Item>
            <Button
              positive
              as={NavLink}
              to="/createActivity"
              content="Create Activity"
            />
          </Menu.Item>
          <Menu.Item position='right'>
            <Image src={user?.image || 'assets/user.png'} avatar spaced='right' />
            <Dropdown pointing='top left'>
              <Dropdown.Menu>
                <Dropdown.Item as={Header} content={user.displayName}></Dropdown.Item>
                <Dropdown.Item as={Link} to={`/profile/${user?.displayName}`} text='My Profile' icon='user'></Dropdown.Item>
                <Dropdown.Item onClick={logout} content='Logout' icon='power'></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </>}
      </Container>
    </Menu>
  );
})