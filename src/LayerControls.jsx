import React, {useState} from 'react';

import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';

import CreateLayerModal from './CreateLayerModal.jsx';
import ModalGateway from './ModalGateway.jsx';


export default function () {
  const [showModal, setShowModal] = useState(true);
  return (
    <>
      <Card className="shadow-sm">
        <Container as={Card.Header} className="p-2">
          <Row>
            <Col>Layers</Col>
            <Col xs="auto">
              <Button size="sm" onClick={() => setShowModal(true)}><i className="fas fa-plus"></i></Button>
            </Col>
          </Row>
        </Container>
        <Card.Body className="p-2">
        </Card.Body>
      </Card>
      <ModalGateway show={showModal}>
        <CreateLayerModal onCancel={() => setShowModal(false)}/>
      </ModalGateway>
    </>
  );
};
