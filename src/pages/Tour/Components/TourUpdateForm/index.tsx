import { FC, useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { TourUpdate } from "../../../../models/TourUpdate";
import { TourService } from "../../../../services/Tour";

export const TourUpdateForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { updateTour, getTourById, uploadImage } = TourService();
  const [tour, setTour] = useState<TourUpdate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        return;
      }
      try {
        const tourData: any = await getTourById(id);
        setTour(tourData.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch tour data", error);
      }
    };
    fetchTour();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const uploadedImages: string[] = [];
      for (const file of files) {
        try {
          const publicId = await uploadImage(file);
          if (publicId) {
            uploadedImages.push(publicId);
          }
        } catch (error) {
          console.error("Failed to upload image", error);
        }
      }
      setImages((prevImages) => [...prevImages, ...uploadedImages]);
    }
  };

  const saveTour = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !tour) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    const updatedData: TourUpdate = {
      _id: tour._id,
      city: formData.get("city") as string,
      attractions: formData.get("attractions") as string,
      days: formData.get("days") as string,
      prices: {
        adult: formData.get("adultPrice") as string,
        child: formData.get("childPrice") as string,
      },
      guide: tour.guide,
      images: images,
      createAt: tour.createAt,
    };

    try {
      await Promise.all([updateTour(updatedData), images]);
      alert("Updated tour");
      navigate("/dashboard/manage-tour/tour")
    } catch (error) {
      alert("Failed to update tour.");
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

  if (!tour) {
    return (
      <Container>
        <h2>Tour not found</h2>
        <Button
          onClick={() => navigate("/dashboard/manage-tour/tour")}
          variant="secondary"
        >
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Update Tour</h1>
      <Form onSubmit={saveTour}>
        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            defaultValue={tour.city}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Attractions</Form.Label>
          <Form.Control
            type="text"
            name="attractions"
            placeholder="Enter attractions, separated by commas"
            defaultValue={tour.attractions}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Days</Form.Label>
          <Form.Control
            type="text"
            name="days"
            defaultValue={tour.days}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Adult Price</Form.Label>
          <Form.Control
            type="number"
            name="adultPrice"
            defaultValue={tour.prices.adult}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Child Price</Form.Label>
          <Form.Control
            type="number"
            name="childPrice"
            defaultValue={tour.prices.child}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/dashboard/manage-tour/tour")}
        >
          Cancel
        </Button>
      </Form>
      <br />
    </Container>
  );
};
