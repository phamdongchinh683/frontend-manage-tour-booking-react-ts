import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
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
import { GuideList } from "../../../../models/GuideList";
import { ProvinceResponse } from "../../../../models/ProvinceResponse";
import { TourCreation } from "../../../../models/TourCreation";
import { TourService } from "../../../../services/Tour";
import { UserService } from "../../../../services/User";

export const TourCreationForm: FC = () => {
  const navigate = useNavigate();
  const { AddTours, uploadImage } = TourService();
  const { provinceVietNam, guideList } = UserService();
  const [province, setProvinces] = useState<ProvinceResponse[]>([]);
  const [guide, setGuides] = useState<GuideList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tourList, setTourList] = useState<TourCreation[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<TourCreation>({
    city: "",
    attractions: "",
    days: "",
    prices: {
      adult: 0,
      child: 0,
    },
    guide: "",
    images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provinceList, guides] = await Promise.all([
          provinceVietNam(),
          guideList(),
        ]);
        setProvinces(provinceList);
        setGuides(guides);
      } catch (err) {
        setError("Failed to load provinces or guides.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const savedTours = localStorage.getItem("tours");
    setTourList(savedTours ? JSON.parse(savedTours) : []);
  }, []);

  const deleteTourById = (index: number) => {
    const saveTours = localStorage.getItem("tours");
    const tours = saveTours ? JSON.parse(saveTours) : [];

    tours.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(tours));

    setTourList(tours);
  };
  const validateForm = (): string | null => {
    if (!data.city.trim()) return "City is required.";
    if (!data.attractions.trim()) return "Attractions must be specified.";
    if (!data.days || isNaN(Number(data.days)) || Number(data.days) <= 0) {
      return "Please provide a valid number of days.";
    }
    if (
      data.prices.adult <= 0 ||
      data.prices.child < 0 ||
      isNaN(data.prices.adult) ||
      isNaN(data.prices.child)
    ) {
      return "Prices must be valid and non-negative.";
    }
    if (!data.guide.trim()) return "Please select a guide.";
    if (images.length === 0) return "Please upload at least one image.";
    return null;
  };

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
          setError(`Failed to upload image: ${file.name}`);
        }
      }
      setImages((prev) => [...prev, ...uploadedImages]);
    }
  };

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    if (name === "adult" || name === "child") {
      setData((prevData) => ({
        ...prevData,
        prices: {
          ...prevData.prices,
          [name]: Number(value),
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setError(error);
      return;
    }
    setError(null);
    const newTour = { ...data, images };
    const updatedTours = [...tourList, newTour];
    localStorage.setItem("tours", JSON.stringify(updatedTours));
    setTourList(updatedTours);
    alert("Tour created successfully!");
    setData({
      city: "",
      attractions: "",
      days: "",
      prices: {
        adult: 0,
        child: 0,
      },
      guide: "",
      images: [],
    });
    setImages([]);
  };

  const saveToursToDatabase = async () => {
    const savedTours = localStorage.getItem("tours");
    const tours = savedTours ? JSON.parse(savedTours) : [];
    const result = await AddTours({ tours });

    if (!result) {
      alert("No tours have been created. Please add tours before saving.");
    } else {
      alert("Tours have been successfully saved to the database.");
      localStorage.removeItem("tours");
      navigate("/dashboard/manage-tour/tour");
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
    <Container>
      <div className="tours-header d-flex justify-content-between align-items-center">
        <h1>Create Tours</h1>
      </div>
      <Row className="mt-2">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              Create New Tour
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
                <Form.Group controlId="formCity" className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Select
                    name="city"
                    value={data.city}
                    onChange={handleChange}
                  >
                    <option value="">Select City...</option>
                    {province.map((param) => (
                      <option
                        key={param.province_id}
                        value={param.province_name}
                      >
                        {param.province_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formAttractions" className="mb-3">
                  <Form.Label>Attractions</Form.Label>
                  <Form.Control
                    type="text"
                    name="attractions"
                    placeholder="e.g., Beach, Mountain"
                    value={data.attractions}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDays" className="mb-3">
                  <Form.Label>Days</Form.Label>
                  <Form.Control
                    type="text"
                    name="days"
                    placeholder="e.g., 3 days"
                    value={data.days}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPrices" className="mb-3">
                  <Form.Label>Prices</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Adult Price"
                        name="adult"
                        value={data.prices.adult}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Child Price"
                        name="child"
                        value={data.prices.child}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="formGuides" className="mb-3">
                  <Form.Label>Guide</Form.Label>
                  <Form.Select
                    name="guide"
                    value={data.guide}
                    onChange={handleChange}
                  >
                    <option value="">Select Guide...</option>
                    {guide.map((param) => (
                      <option key={param._id} value={param._id}>
                        {param.fullName.firstName + param.fullName.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formImages" className="mb-3">
                  <Form.Label>Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    name="images"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Create Tour
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-secondary text-white">
              Created Tours
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Days</th>
                    <th>Adult Price</th>
                    <th>Child Price</th>
                    <th>Guide</th>
                    <th>Images</th>
                  </tr>
                </thead>
                <tbody>
                  {tourList.map((tour, index) => (
                    <tr key={index}>
                      <td className="text-truncate-column">{tour.city}</td>
                      <td className="text-truncate-column">{tour.days}</td>
                      <td className="text-truncate-column">
                        {tour.prices.adult}
                      </td>
                      <td className="text-truncate-column">
                        {tour.prices.child}
                      </td>
                      <td className="text-truncate-column">{tour.guide}</td>
                      <td className="text-truncate-column">
                        {tour.images.length} Images
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteTourById(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Row className="mt-3">
                <Col className="d-flex justify-content-between align-items-center">
                  <span>Save these users to the database</span>
                  <Button variant="success" onClick={saveToursToDatabase}>
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
