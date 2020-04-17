import React, {useState} from 'react';

import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';

import ProjectionSchema from './ProjectionSchema.jsx';


function cloneMatrix(matrix) {
  return matrix.map(row => row.slice());
}


export default function ({onCancel}) {
  const preset = {
    orthogonal: [
      [48, 0, 0],
      [0, 48, 0],
      [0, 0, 1],
    ],
    isometric: [
      [-48, 48, 0],
      [24, 24, -48],
      [1, 1, 1],
    ],
  };
  const [matrix, setMatrix] = useState(preset.orthogonal);
  const setCell = (i, j, value) => {
    if (!isNaN(value)) {
      const newMatrix = cloneMatrix(matrix);
      newMatrix[i][j] = value;
      setMatrix(newMatrix);
    }
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
                <Form.Group as={Row}>
                  <Form.Label column sm="2">Preset</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      as="select"
                      defaultValue="orthogonal"
                      onChange={event => setMatrix(preset[event.target.value])}
                    >
                      <option value="orthogonal">Orthogonal</option>
                      <option value="isometric">Isometric</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <ProjectionSchema matrix={matrix}/>
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
                          onChange={event => setCell(i, j, parseInt(event.target.value, 10))}
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
