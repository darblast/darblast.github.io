import React from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Navbar,
  Row,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';

import Canvas from './Canvas.jsx';
import LayerControls from './LayerControls.jsx';


export default function () {
  return (
    <Container fluid className="p-0" style={{
      height: '100%',
    }}>
      <Row noGutters sm="auto">
        <Col>
          <Navbar bg="primary" variant="dark" className="shadow-sm">
            <Navbar.Brand href="/">Darblast</Navbar.Brand>
          </Navbar>
        </Col>
      </Row>
      <Row noGutters>
        <Col sm="auto" className="d-flex align-items-stretch">
          <Card className="rounded-0 border-top-0 border-left-0 border-bottom-0 shadow-sm">
            <Card.Body className="p-2">
              <ToggleButtonGroup vertical type="radio" name="tool" defaultValue="pan">
                <ToggleButton size="lg" value="pan"><i className="fas fa-hand-paper"></i></ToggleButton>
                <ToggleButton size="lg" value="stamp"><i className="fas fa-stamp"></i></ToggleButton>
                <ToggleButton size="lg" value="fill"><i className="fas fa-fill-drip"></i></ToggleButton>
                <ToggleButton size="lg" value="erase"><i className="fas fa-eraser"></i></ToggleButton>
              </ToggleButtonGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Canvas/>
        </Col>
        <Col sm="auto" className="d-flex align-items-stretch">
          <Card className="rounded-0 border-top-0 border-right-0 border-bottom-0 shadow-sm">
            <Card.Body className="p-2">
              <LayerControls/>
              <Card className="shadow-sm">
                <Card.Header className="p-2">Planes</Card.Header>
                <Card.Body className="p-2">
                  <ButtonGroup>
                    <Button size="sm"><i className="fas fa-plus"></i></Button>
                    <Button size="sm" disabled><i className="fas fa-cog"></i></Button>
                    <Button size="sm" disabled><i className="fas fa-trash"></i></Button>
                  </ButtonGroup>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row noGutters sm="auto">
        <Col>
          <Card body className="rounded-0 shadow-sm">
            <Tabs defaultActiveKey="fragments">
              <Tab eventKey="fragments" title="Fragments">
                <Card body>Fragments</Card>
              </Tab>
              <Tab eventKey="tiles" title="Tiles">
                <Card body>Tiles</Card>
              </Tab>
              <Tab eventKey="elements" title="Elements">
                <Card body>Entities</Card>
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
