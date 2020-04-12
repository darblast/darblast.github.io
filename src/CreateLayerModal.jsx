import React, {useState} from 'react';

import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';

import SchemaCanvas from './SchemaCanvas.jsx';


export default function ({onCancel}) {
  const [matrix, setMatrix] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
  const setCell = (i, j, value) => {
    matrix[i][j] = value;
    setMatrix(matrix);
  };
  return (
    <Modal show onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Layer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Control></Form.Control>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <SchemaCanvas/>
            </Col>
            <Col xs="auto">
              <Container className="p-0">
                {matrix.map((row, i) => (
                  <Row key={i} noGutters>
                    {row.map((cell, j) => (
                      <Col key={j}>
                        <input
                          type="number"
                          name={`m${i}${j}`}
                          value={cell}
                          required
                          onChange={event => setCell(i, j, event.target.value)}
                          style={{width: '3em'}}/>
                      </Col>
                    ))}
                  </Row>
                ))}
              </Container>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary">Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
