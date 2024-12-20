import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Col, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentDetail } from "../../../../models/PaymentDetail";
import { PaymentUpdate } from "../../../../models/PaymentUpdate";
import { UsersResponse } from "../../../../models/UsersReponse";
import { BookTourService } from "../../../../services/BookTour";
import { PaymentService } from "../../../../services/Payment";
import { UserService } from "../../../../services/User";

export const PaymentUpdateForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPaymentById, updatePayment } = PaymentService();
  const { bookTourList } = BookTourService();
  const { userList } = UserService();

  const [bookTour, setBookTours] = useState<any[]>([]);
  const [users, setUsers] = useState<UsersResponse[]>([]);
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<PaymentUpdate>({
    bookingId: "",
    userId: "",
    status: 0,
    cardNumber: "",
    totalAmount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) {
        return;
      }
      try {
        const [paymentData, users, bookTours] = await Promise.all([
          getPaymentById(id),
          userList(),
          bookTourList(),
        ]);
        setPayment(paymentData.data);
        setUsers(users.data);
        setBookTours(bookTours.data);
        setFormData({
          bookingId: paymentData.data.booking_id?._id || "",
          userId: paymentData.data.user_id?.fullName.firstName || "",
          status: paymentData.data.status || 0,
          cardNumber: paymentData.data.card_number || "",
          totalAmount: paymentData.data.total_amount || 0,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPayment();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "totalAmount" ? Number(value) : value,
    }));
  };

  const statusPayment = [
    { id: 0, value: 0, note: "pending" },
    { id: 1, value: 1, note: "completed" },
  ];

  const savePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      return;
    }

    const updatedData: PaymentUpdate = {
      bookingId: formData.bookingId,
      userId: formData.userId,
      status: formData.status,
      cardNumber: formData.cardNumber,
      totalAmount: formData.totalAmount,
    };

    try {
      let update = await updatePayment(id, updatedData);
      if (update.status === "success") {
        alert("Payment updated successfully");
        navigate("/dashboard/manage-payment/payment-list");
      }
      alert("Failed");
    } catch (error) {
      alert("Failed to update payment.");
      console.error(error);
    }
  };

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
      <Container>
        <h2>Payment not found</h2>
        <Button
          onClick={() => navigate("/dashboard/manage-payment/payment-list")}
          variant="secondary"
        >
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Update Payment</h1>
      <Form onSubmit={savePayment}>
        <Form.Group>
          <Form.Label>Booking ID</Form.Label>
          <Form.Select
            name="bookingId"
            value={formData.bookingId}
            onChange={handleChange}
            required
          >
            <option value="">Select Booking</option>
            {bookTour.map((param) => (
              <option key={param._id} value={param._id}>
                {param.tour_id.city} <span>({param.user_id.username})</span>
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>User</Form.Label>
          <Form.Select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName.firstName} {user.fullName.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {statusPayment.map((status) => (
              <option key={status.id} value={status.id}>
                {status.note}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="number"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <div className="pt-3">
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => navigate("/dashboard/manage-payment/payment-list")}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};
