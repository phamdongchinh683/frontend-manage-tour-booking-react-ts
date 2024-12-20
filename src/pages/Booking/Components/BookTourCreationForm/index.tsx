import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BookingCreation } from "../../../../models/BookingCreation";
import { IBookingList } from "../../../../models/BookingList";
import { GuideList } from "../../../../models/GuideList";
import { TourListResponse } from "../../../../models/TourListResponse";
import { UsersResponse } from "../../../../models/UsersReponse";
import { BookTourService } from "../../../../services/BookTour";
import { TourService } from "../../../../services/Tour";
import { UserService } from "../../../../services/User";
import { hours } from "../../../../utils/generateHours";
export const BookTourCreationForm: FC = () => {
  const navigate = useNavigate();
  const { tourList } = TourService();
  const { addBookTours } = BookTourService();
  const { guideList, userList } = UserService();
  const [tours, setTours] = useState<TourListResponse[]>([]);
  const [guides, setGuides] = useState<GuideList[]>([]);
  const [users, setUsers] = useState<UsersResponse[]>([]);
  const [bookings, setBookingList] = useState<IBookingList[]>([]);
  const [data, setData] = useState<BookingCreation>({
    user_id: "",
    tour_id: "",
    guide_id: "",
    number_visitors: 1,
    start_tour: "",
    start_time: "",
    end_time: "",
    status: 0,
    card_number: "",
    total_amount: 20,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guide, user, tour]: any = await Promise.all([
          guideList(),
          userList(),
          tourList(),
        ]);
        setGuides(guide);
        setUsers(user.data);
        setTours(tour.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    const bookToured = localStorage.getItem("bookings");
    const bookTours = bookToured ? JSON.parse(bookToured) : [];
    setBookingList(bookTours);
  }, []);
  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "number_visitors" ? Number(value) : value,
    }));
  };

  const deleteBooking = (index: number) => {
    const saveBooking = localStorage.getItem("bookings");
    const booking = saveBooking ? JSON.parse(saveBooking) : [];
    booking.splice(index, 1);
    setBookingList(booking);
    localStorage.setItem("bookings", JSON.stringify(booking));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {
      user_id,
      tour_id,
      guide_id,
      number_visitors,
      start_tour,
      start_time,
      end_time,
      total_amount,
      status,
      card_number,
    } = data;
    if (
      !user_id ||
      !tour_id ||
      !guide_id ||
      !start_tour ||
      !start_time ||
      !end_time ||
      !total_amount ||
      !card_number
    ) {
      alert("Please fill in all fields.");
      return;
    }
    setData({
      user_id: "",
      tour_id: "",
      guide_id: "",
      number_visitors: 1,
      start_tour: "",
      start_time: "",
      end_time: "",
      status: 0,
      card_number: "",
      total_amount: 20,
    });
    const saveBooking = localStorage.getItem("bookings");
    const booking = saveBooking ? JSON.parse(saveBooking) : [];
    booking.push(data);
    setBookingList(booking);
    localStorage.setItem("bookings", JSON.stringify(booking));
  };

  const saveBooking = async () => {
    const saveBooking = localStorage.getItem("bookings");
    const booking = saveBooking ? JSON.parse(saveBooking) : [];
    const result: any = await addBookTours({ bookTours: booking });
    if (result === "Exited") {
      alert(
        "Some booking already exist in the system. Please review the data."
      );
    } else if (booking.length === 0) {
      alert("No booking have been created. Please add booking before saving.");
    } else {
      alert("booking have been successfully saved to the database.");
      localStorage.removeItem("bookings");
      navigate("/dashboard/manage-book-tour/book-tour-list");
    }
  };

  const statusPayment = [
    {
      id: 0,
      value: 0,
      note: "pending",
    },
    {
      id: 1,
      value: 1,
      note: "completed",
    },
  ];

  return (
    <Container>
      <div className="booking-header d-flex justify-content-between align-items-center">
        <h1>Create Book Tour</h1>
      </div>
      <Row className="mt-2 d-flex justify-content-between">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              Create new book tour
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridTour">
                    <Form.Label>Tour</Form.Label>
                    <Form.Select
                      name="tour_id"
                      value={data.tour_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Tour</option>
                      {tours.map((tour) => (
                        <option key={tour._id} value={tour._id}>
                          {tour.city + "-" + tour.attractions}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>User</Form.Label>
                    <Form.Select
                      name="user_id"
                      value={data.user_id}
                      onChange={handleChange}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.fullName?.firstName +
                            " " +
                            user.fullName?.lastName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridUser">
                    <Form.Label>Guide</Form.Label>
                    <Form.Select
                      name="guide_id"
                      value={data.guide_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Guide</option>
                      {guides.map((guide) => (
                        <option key={guide._id} value={guide._id}>
                          {guide.fullName?.firstName +
                            " " +
                            guide.fullName?.lastName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridDate">
                    <Form.Label>Start tour</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Date"
                      name="start_tour"
                      value={data.start_tour}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridTime">
                    <Form.Label>Start</Form.Label>
                    <Form.Select
                      name="start_time"
                      value={data.start_time}
                      onChange={handleChange}
                    >
                      <option value="">Start Time</option>
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>End</Form.Label>
                    <Form.Select
                      name="end_time"
                      value={data.end_time}
                      onChange={handleChange}
                    >
                      <option value="">End Time</option>
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="d-flex justify-content-between align-items-center">
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Number of visitor</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Number of visitor"
                      name="number_visitors"
                      min={1}
                      value={data.number_visitors}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g 5555 5555 5555 4444"
                      name="card_number"
                      value={data.card_number}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Total amount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Total amount"
                      name="total_amount"
                      min={20}
                      value={data.total_amount}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Col className=" d-flex align-items-center justify-content-center pb-4 ">
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
                </Col>
                <div className="d-flex align-items-center">
                  <Button variant="primary" type="submit" className="w-48">
                    Create
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-secondary text-white">
              Created book tour
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tour</th>
                      <th>Guide</th>
                      <th>User</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((bookTour: any, index: any) => (
                      <tr key={index}>
                        <td className="text-truncate-column">
                          {bookTour.tour_id}
                        </td>
                        <td className="text-truncate-column">
                          {bookTour.guide_id}
                        </td>
                        <td className="text-truncate-column">
                          {bookTour.user_id}
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteBooking(index)}
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
                  <span>Save these book tour to the database</span>
                  <Button variant="primary" onClick={saveBooking}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
    </Container>
  );
};
