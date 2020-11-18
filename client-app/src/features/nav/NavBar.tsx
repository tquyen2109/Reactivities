import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}
export const NavBar: React.FC<IProps>= ({openCreateForm}) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
            <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>  
            Reactivities
        </Menu.Item> 
        <Menu.Item name="messages" />
        <Menu.Item>
            <Button onClick={openCreateForm} positive content="Create Activity">Create Activity </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
