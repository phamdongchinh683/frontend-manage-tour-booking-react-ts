import { FC, useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { GuideList } from "../../../../models/GuideList";
import { TourListResponse } from "../../../../models/TourListResponse";
import { UpdateBookTour } from "../../../../models/UpdateBookTour";
import { UsersResponse } from "../../../../models/UsersReponse";
import { BookTourService } from "../../../../services/BookTour";
import { TourService } from "../../../../services/Tour";
import { UserService } from "../../../../services/User";

export const BookTourUpdateForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookTourById, updateBookTour } = BookTourService();
  const { guideList, userList } = UserService();
  const { tourList } = TourService();
  const [guides, setGuides] = useState<GuideList[]>([]);
  const [tours, setTours] = useState<TourListResponse[]>([]);
  const [users, setUsers] = useState<UsersResponse[]>([]);

  const [bookTour, setBookTour] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [response, guide, user, tour]: any = await Promise.all([
          getBookTourById(id),
          guideList(),
          userList(),
          tourList(),
        ]);
        setGuides(guide);
        setTours(tour.data);
        setUsers(user.data);
        setBookTour(response);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
      }
    };
    fetchData();
  }, []);

  const saveBookTour = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !bookTour) return;
    const formData = new FormData(e.currentTarget);
    const updatedData: UpdateBookTour = {
      userId: formData.get("userId") as string,
      tourId: formData.get("tourId") as string,
      guideId: formData.get("guideId") as string,
      numberVisitor: parseInt(formData.get("numberVisitor") as string, 10),
      startTour: formData.get("startTour") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
    };
    try {
      await updateBookTour(id, updatedData);
      navigate("/dashboard/manage-book-tour/book-tour-list");
    } catch (error) {
      alert("please not empty fields");
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

  if (!bookTour) {
    return (
      <Container>
        <h2>Booking not found</h2>
        <Button
          onClick={() => navigate("/dashboard/manage-book-tour/book-tour-list")}
          variant="secondary"
        >
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Update Book Tour</h1>
      <Form onSubmit={saveBookTour}>
        <Form.Group className="mb-3">
          <Form.Label>User</Form.Label>
          <Form.Select name="userId" defaultValue={bookTour.user_id} required>
            <option value="">{bookTour.user_id}</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName?.firstName + " " + user.fullName?.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tour</Form.Label>
          <Form.Select name="tourId" defaultValue={bookTour.tour_id} required>
            <option>{bookTour.tour_id}</option>
            {tours.map((tour) => (
              <option key={tour._id} value={tour._id}>
                {tour.city + " - " + tour.attractions}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Guide</Form.Label>
          <Form.Select name="guideId" defaultValue={bookTour.guide_id} required>
            <option>Select Guide</option>
            {guides.map((guide) => (
              <option key={guide._id} value={guide._id}>
                {guide.fullName?.firstName + " - " + guide.fullName?.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Number of Visitors</Form.Label>
          <Form.Control
            type="number"
            name="numberVisitor"
            defaultValue={bookTour.number_visitors}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Tour</Form.Label>
          <Form.Control
            type="date"
            name="startTour"
            defaultValue={bookTour.start_tour}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="time"
            name="startTime"
            defaultValue={bookTour.time?.start_time}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="time"
            name="endTime"
            defaultValue={bookTour.time?.end_time}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/dashboard/manage-book-tour/book-tour-list")}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};
