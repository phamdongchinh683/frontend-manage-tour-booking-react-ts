import React from "react";
import { Card, Container, Row } from "react-bootstrap";
import { IDetail } from "../../models/IDetail";

const Detail: React.FC<IDetail> = ({
  titleDetail,
  name,
  fields,
  edit,
  back,
}) => {
  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center text-primary">{titleDetail}</h1>
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Header className="bg-info text-white text-center p-4">
          <h4 className="mb-0">{name}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">{fields}</Row>
          <div className="d-flex justify-content-end mt-4">
            <div className="d-flex">
              {edit}
              {back}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Detail;
