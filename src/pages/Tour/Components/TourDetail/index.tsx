import { FC, useEffect, useState } from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { TourDetail } from "../../../../models/TourDetail";
import { TourService } from "../../../../services/Tour";
import TourImage from "../TourImage"; // Make sure you have the correct component for displaying images

export const TourDetailById: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTourById } = TourService();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        return;
      }
      try {
        const tourData = await getTourById(id);
        setTour(tourData.data);
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

  if (!tour) {
    return (
      <div className="text-center mt-4">
        <h2>Tour not found</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/manage-tour/tour")}
        >
          Back to tour List
        </Button>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Tour Details</h1>
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{tour.city}</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>ID:</strong> {tour._id}
          </div>
          <div className="mb-3">
            <strong>City:</strong> {tour.city}
          </div>
          <div className="mb-3">
            <strong>Attractions:</strong> {tour.attractions.join(", ")}
          </div>
          <div className="mb-3">
            <strong>Days:</strong> {tour.days}
          </div>
          <div className="mb-3">
            <strong>Prices:</strong> Adult: {tour.prices.adult}, Child:{" "}
            {tour.prices.child}
          </div>

          {tour.guides && tour.guides.length > 0 && (
            <div className="mb-3">
              <strong>Guides:</strong>
              <ul>
                {tour.guides.map((guide) => (
                  <li key={guide._id}>
                    {guide.fullName.firstName} {guide.fullName.lastName}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-3">
            <strong>Images:</strong>
            <div className="d-flex align-items-center gap-4">
              {tour.images.length > 0 ? (
                tour.images.map((image, index) => (
                  <div key={index}>
                    <TourImage avatar={image} />
                  </div>
                ))
              ) : (
                <p>No images please add a few pictures for this tour</p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <strong>Created At:</strong>{" "}
            {new Date(tour.createAt).toLocaleString()}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => navigate(`/dashboard/manage-tour/edit-tour/${id}`)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/manage-tour/tour")}
            >
              Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
