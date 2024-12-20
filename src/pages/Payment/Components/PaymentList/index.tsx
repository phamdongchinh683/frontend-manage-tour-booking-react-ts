import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonPage from "../../../../components/Button";
import TableList from "../../../../components/TableList";
import { PaymentsResponse } from "../../../../models/PaymentsResponse";
import { PaymentService } from "../../../../services/Payment";

export const PaymentList: FC = () => {
  const { getPayments, deletePayments } = PaymentService();
  const [list, setList] = useState<PaymentsResponse[]>([]);
  const [checkedPayment, setCheckedPayment] = useState<{
    [key: string]: boolean;
  }>({});
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const query = new URLSearchParams(useLocation().search);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const fetchPayments = async (cursor: string | null, direction: string) => {
    try {
      const page: any = await getPayments(cursor, direction);
      setList(page.paymentList);
      setNextCursor(page.nextCursor);
      setPrevCursor(page.prevCursor);
      setCheckedPayment({});
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  useEffect(() => {
    const cursorQuery = query.get("cursor");
    const directionQuery = query.get("direction") || "next";
    if (cursorQuery) {
      fetchPayments(cursorQuery, directionQuery);
    } else {
      fetchPayments(null, "next");
    }
  }, []);

  const pageNext = () => {
    if (nextCursor) {
      fetchPayments(nextCursor, "next");
      navigate(
        `/dashboard/manage-payment/payment-list?cursor=${nextCursor}&direction=next`
      );
    }
  };

  const pagePrev = () => {
    if (prevCursor) {
      fetchPayments(prevCursor, "prev");
      navigate(
        `/dashboard/manage-payment/payment-list?cursor=${prevCursor}&direction=prev`
      );
    }
  };

  const updateCheckedState = (updatedState: { [key: string]: boolean }) => {
    setCheckedPayment(updatedState);
    setSelectAll(Object.values(updatedState).every(Boolean));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    paymentId: string
  ) => {
    updateCheckedState({ ...checkedPayment, [paymentId]: e.target.checked });
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedState = Object.fromEntries(
      list.map((payment) => [payment._id, isChecked])
    );
    updateCheckedState(updatedState);
  };

  const getSelectedPayments = () => {
    return Object.keys(checkedPayment).filter(
      (paymentId) => checkedPayment[paymentId]
    );
  };

  const editPayment = (paymentId: string) => {
    navigate(`/dashboard/manage-payment/edit-payment/${paymentId}`, {
      state: { paymentId },
    });
  };

  const deletePaymentById = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      await deletePayments([{ _id: paymentId }]);
      setList((prevList) =>
        prevList.filter((payment) => payment._id !== paymentId)
      );
    } catch (error) {
      console.error("Failed to delete the payment:", error);
    }
  };

  const deleteSelectedPayments = async () => {
    const selectedIds = getSelectedPayments();
    if (selectedIds.length === 0) {
      alert("Please select payments to delete.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the selected payments?")
    ) {
      return;
    }

    try {
      const ids = selectedIds.map((id) => ({ _id: id }));
      await deletePayments(ids);
      setList((prevList) =>
        prevList.filter((payment) => !selectedIds.includes(payment._id))
      );
    } catch (error) {
      console.error("Failed to delete selected payments:", error);
    }
  };

  const tableData = list.map((payment) => (
    <tr key={payment._id} className="align-middle text-center">
      <td>
        <input
          type="checkbox"
          checked={checkedPayment[payment._id] || false}
          onChange={(e) => handleCheckboxChange(e, payment._id)}
        />
      </td>
      <td>{payment.booking_id}</td>
      <td>{payment.user_id}</td>
      <td>{payment.status}</td>
      <td>{payment.card_number}</td>
      <td>{payment.total_amount}</td>
      <td className="d-flex gap-1 justify-content-center align-items-center">
        <Button
          variant="info"
          className="me-2"
          onClick={() =>
            navigate(`/dashboard/manage-payment/detail-payment/${payment._id}`)
          }
        >
          Detail
        </Button>
        <ButtonPage
          color="primary"
          text="Edit"
          fun={() => editPayment(payment._id)}
        />
        <ButtonPage
          color="danger"
          text="Delete"
          fun={() => deletePaymentById(payment._id)}
        />
      </td>
    </tr>
  ));

  return (
    <TableList
      title="Payments"
      create={
        <Link to="/dashboard/manage-payment/create-payment">
          <Button variant="success">Create</Button>
        </Link>
      }
      deletes={
        <Button variant="danger" onClick={deleteSelectedPayments}>
          Delete payments
        </Button>
      }
      data={
        list.length === 0 ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" variant="primary" />
            <span>There are currently no payments available</span>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th>Booking Id</th>
                <th>User Id</th>
                <th>status</th>
                <th>card_number</th>
                <th>total_amount</th>
              </tr>
            </thead>
            <tbody>{tableData}</tbody>
          </Table>
        )
      }
      page={
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={pagePrev} disabled={!prevCursor}>
            Previous
          </Button>
          <Button variant="primary" onClick={pageNext} disabled={!nextCursor}>
            Next
          </Button>
        </div>
      }
    />
  );
};
