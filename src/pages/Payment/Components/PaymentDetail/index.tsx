import { FC, useEffect, useState } from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentDetail } from "../../../../models/PaymentDetail";
import { PaymentService } from "../../../../services/Payment";
import { formatDate } from "../../../../utils/formartDate";

export const PaymentDetailById: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPaymentById } = PaymentService();
  const [payment, setPayment] = useState<PaymentDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) {
        return;
      }
      try {
        const paymentData = await getPaymentById(id);
        setPayment(paymentData.data);
        setLoading(false);
      } catch (error) {
        setLoading(true);
      }
    };
    fetchPayment();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center mt-4">
        <h2>payment not found</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/manage-payment/payment")}
        >
          Back to payment List
        </Button>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">payment Details</h1>
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{"Payment Details"}</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>ID: </strong> {payment._id}
          </div>
          <div className="mb-3">
            <strong>City: </strong> {payment.booking_id?.tour_id.city}
          </div>
          <div className="mb-3">
            <strong>Start payment: </strong>
            {formatDate(payment.booking_id?.createAt)}
          </div>
          <div className="mb-3">
            <strong>Card number:</strong> {payment.card_number}
          </div>
          <div className="mb-3">
            <strong>User: </strong> {payment.user_id?.fullName?.firstName}{" "}
            {payment.user_id?.fullName?.lastName}
          </div>
          <div className="mb-3">
            <strong>Status: </strong>{" "}
            {payment.status === 1 ? "Completed" : "Pending"}
          </div>
          <div className="mb-3">
            <strong>Card Number: </strong> {payment.card_number}
          </div>
          <div className="mb-3">
            <strong>Total Amount: </strong> {payment.total_amount}
          </div>
          <div className="d-flex justify-content-end pt-10">
            <Button
              variant="primary"
              className="me-2"
              onClick={() =>
                navigate(`/dashboard/manage-payment/edit-payment/${id}`)
              }
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/manage-payment/payment-list")}
            >
              Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
