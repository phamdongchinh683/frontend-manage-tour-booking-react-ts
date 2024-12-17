import { FC, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Detail from "../../../../components/Detail";
import { BookingDetail } from "../../../../models/BookingDetail";
import { BookTourService } from "../../../../services/BookTour";

export const BookTourDetailById: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookTourById } = BookTourService();
  const [bookTour, setBookTour] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        return;
      }
      try {
        const bookDetail: any = await getBookTourById(id);
        setBookTour(bookDetail);
        setLoading(false);
      } catch (error) {
        setLoading(true);
      }
    };
    fetchTour();
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

  if (!bookTour) {
    return (
      <div className="text-center mt-4">
        <h2>Book Tour not found</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/manage-book-tour/book-tour-list")}
        >
          Back to Book Tour List
        </Button>
      </div>
    );
  }

  return (
    <Detail
      titleDetail="Book Tour"
      name="Detail"
      fields={
        <>
          <div>
            <strong>ID:</strong> {bookTour.number_visitors}
          </div>
          <div className="mb-3">
            <strong>City:</strong> {bookTour.time?.end_time}
          </div>
          <div className="mb-3">
            <strong>Attractions:</strong> {bookTour.tour_id}
          </div>
          <div className="mb-3">
            <strong>Days:</strong> {bookTour.user_id}
          </div>
          <div className="mb-3">
            <strong>Prices:</strong> Adult: {bookTour.time?.start_time}
          </div>
          <div className="mb-3">
            <strong>Created At:</strong>{" "}
            {new Date(bookTour.createAt).toLocaleString()}
          </div>
        </>
      }
      edit={
        <Button
          variant="primary"
          className="me-2"
          onClick={() =>
            navigate(`/dashboard/manage-book-tour/edit-book-to/${id}`)
          }
        >
          Edit
        </Button>
      }
      back={
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/manage-book-tou/book-tour-list")}
        >
          Back
        </Button>
      }
    />
  );
};
