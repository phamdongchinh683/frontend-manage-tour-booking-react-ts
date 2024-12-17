import React from "react";
import { Card, Container } from "react-bootstrap";
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
      <h1 className="mb-4 text-center">{titleDetail}</h1>
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{name}</h4>
        </Card.Header>
        <Card.Body>
          {fields}
          <div className="d-flex justify-content-end mt-4">
            {edit}
            {back}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Detail;
