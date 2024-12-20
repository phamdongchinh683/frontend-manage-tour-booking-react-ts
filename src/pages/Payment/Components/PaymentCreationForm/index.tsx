import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PaymentCreation } from "../../../../models/PaymentCreation";
import { UsersResponse } from "../../../../models/UsersReponse";
import { BookTourService } from "../../../../services/BookTour";
import { PaymentService } from "../../../../services/Payment";
import { UserService } from "../../../../services/User";

export const PaymentCreationForm: FC = () => {
  const navigate = useNavigate();
  const { bookTourList } = BookTourService();
  const { addPayments } = PaymentService();
  const { userList } = UserService();
  const [payment, setPayments] = useState<PaymentCreation[]>([]);
  const [bookTour, setBookTours] = useState<any[]>([]);
  const [users, setUsers] = useState<UsersResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaymentCreation>({
    booking_id: "",
    user_id: "",
    status: 0,
    card_number: "",
    total_amount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, bookTours] = await Promise.all([
          userList(),
          bookTourList(),
        ]);
        setUsers(users.data);
        setBookTours(bookTours.data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const savedPayments = localStorage.getItem("payments");
    setPayments(savedPayments ? JSON.parse(savedPayments) : []);
  }, []);

  const statusPayment = [
    { id: 0, value: 0, note: "pending" },
    { id: 1, value: 1, note: "completed" },
  ];

  const validateForm = (): string | null => {
    if (!data.booking_id.trim()) {
      return "Booking ID is required.";
    }
    if (!data.user_id.trim()) {
      return "User ID is required.";
    }
    if (!data.status) {
      return "Status is required.";
    }
    if (!/^\d{10,16}$/.test(data.card_number)) {
      return "Card number must be between 10 to 16 digits.";
    }
    if (data.total_amount <= 0 || isNaN(data.total_amount)) {
      return "Total amount must be a positive number.";
    }
    return null;
  };

  const deletePayment = (index: number) => {
    const savePayment = localStorage.getItem("bookings");
    const payment = savePayment ? JSON.parse(savePayment) : [];
    payment.splice(index, 1);
    setPayments(payment);
    localStorage.setItem("bookings", JSON.stringify(payment));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      setData((prevData) => ({
        ...prevData,
        [name]: name === "total_amount" ? Number(value) : value,
      }));
    } else if (e.target instanceof HTMLSelectElement) {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setError(error);
      return;
    }
    setError(null);
    const newPayments = { ...data };
    const updatedPayments = [...payment, newPayments];
    localStorage.setItem("payments", JSON.stringify(updatedPayments));
    setPayments(updatedPayments);
    alert("Payment created successfully!");
    setData({
      booking_id: "",
      user_id: "",
      status: 0,
      card_number: "",
      total_amount: 0,
    });
  };

  const savePayments = async () => {
    const savedPayments = localStorage.getItem("payments");
    const payments = savedPayments ? JSON.parse(savedPayments) : [];
    const result = await addPayments({ payments: payments });

    if (!result) {
      alert(
        "No payments have been created. Please add payments before saving."
      );
    } else {
      alert("Payments have been successfully saved to the database.");
      localStorage.removeItem("payments");
      navigate("/dashboard/manage-payment/payment-list");
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

  return (
    <Container className="pb-3">
      <h1>Create Payments</h1>
      <Row className="mt-2">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              Payment Form
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError(null)}
                  dismissible
                >
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Booking ID</Form.Label>
                  <Form.Select
                    name="booking_id"
                    value={data.booking_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Booking</option>
                    {bookTour.map((param) => (
                      <option key={param._id} value={param._id}>
                        {param.tour_id.city}
                        <span> ({param.user_id.username})</span>
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    name="user_id"
                    value={data.user_id}
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
                <Form.Group as={Col} controlId="formGridPhone">
                  <Form.Label className="pt-2">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={data.status}
                    onChange={handleChange}
                  >
                    <option value="">Select status</option>
                    {statusPayment.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.value + " - " + status.note}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="card_number"
                    value={data.card_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_amount"
                    value={data.total_amount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">
                  Create Payment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-secondary text-white">
              Payments List
            </Card.Header>
            <Card.Body>
              <div style={{ overflowX: "auto" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Card Number</th>
                      <th>Total Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment.map((pay, index) => (
                      <tr key={index}>
                        <td>{pay.booking_id}</td>
                        <td>{pay.user_id}</td>
                        <td>{pay.status}</td>
                        <td>{pay.card_number}</td>
                        <td>{pay.total_amount}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deletePayment(index)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Row className="mt-3">
                <Col className="d-flex justify-content-between align-items-center">
                  <span>Save these payment to the database</span>
                  <Button variant="success" onClick={savePayments}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
