import React, {useState} from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Modal,
  Row,
} from 'react-bootstrap';

import SchemaCanvas from './SchemaCanvas.jsx';


export default function () {
  const [showModal, setShowModal] = useState(true);
  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="p-2">Layers</Card.Header>
        <Card.Body className="p-2">
          <ButtonGroup>
            <Button size="sm" onClick={() => setShowModal(true)}><i className="fas fa-plus"></i></Button>
            <Button size="sm" disabled><i className="fas fa-cog"></i></Button>
            <Button size="sm" disabled><i className="fas fa-trash"></i></Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
      <Modal size="auto" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Layer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col sm="auto">
                <SchemaCanvas/>
              </Col>
              <Col>
                <Container className="p-0">
                  <Row noGutters>
                    <Col><input type="number" value="1" required style={{width: '3em'}}/></Col>
                    <Col><input type="number" value="0" required style={{width: '3em'}}/></Col>
                    <Col><input type="number" value="0" required style={{width: '3em'}}/></Col>
                  </Row>
                  <Row noGutters>
                    <Col><input type="number" value="0" required style={{width: '3em'}}/></Col>
                    <Col><input type="number" value="1" required style={{width: '3em'}}/></Col>
                    <Col><input type="number" value="0" required style={{width: '3em'}}/></Col>
                  </Row>
                  <Row noGutters>
                    <Col><input type="number" value="0" required style={{width: '3em'}}/></Col>
                    <Col><input type="number" value="0" required style={{width: '3em'}}/></Col>
                    <Col><input type="number" value="1" required style={{width: '3em'}}/></Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary">Create</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
