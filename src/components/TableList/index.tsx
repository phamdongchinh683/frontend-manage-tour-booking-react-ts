import React from "react";
import { Container } from "react-bootstrap";
import { ITableList } from "../../models/TableList";

const TableList: React.FC<ITableList> = ({
  title,
  data,
  create,
  deletes,
  page,
}) => {
  return (
    <>
      <Container>
        <div className="header d-flex justify-content-between align-items-center">
          <h1>{title}</h1>
          <div className="d-flex gap-2">
            {create}
            {deletes}
            {page}
          </div>
        </div>
        {data}
      </Container>
    </>
  );
};

export default TableList;
