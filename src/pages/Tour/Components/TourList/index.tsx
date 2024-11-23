import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ButtonPage from "../../../../components/Button";
import { TourListResponse } from "../../../../models/TourListResponse";
import { TourService } from "../../../../services/Tour";

export const TourList: FC = () => {
  const { getTours, deleteTours } = TourService();
  const [list, setList] = useState<TourListResponse[]>([]);
  const [checkedTour, setCheckedTour] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const apiCall = useRef(true);

  const fetchTours = async () => {
    try {
      const tours: any = await getTours();
      setList(tours.data);
      setCheckedTour(checkedTour);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    }
  };

  useEffect(() => {
    if (apiCall.current) {
      apiCall.current = false;
      fetchTours();
    }
  }, []);

  const updateCheckedState = (updatedState: { [key: string]: boolean }) => {
    setCheckedTour(updatedState);
    setSelectAll(Object.values(updatedState).every(Boolean));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    tourId: string
  ) => {
    updateCheckedState({ ...checkedTour, [tourId]: e.target.checked });
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedState = Object.fromEntries(
      list.map((tour) => [tour._id, isChecked])
    );
    updateCheckedState(updatedState);
  };

  const getSelectedTours = () => {
    return Object.keys(checkedTour).filter((tourId) => checkedTour[tourId]);
  };

  const editTour = (tourId: string) => {
    navigate(`/dashboard/manage-tour/edit-tour/${tourId}`, {
      state: { tourId },
    });
  };

  const deleteTourById = async (tourId: string) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) {
      return;
    }

    try {
      await deleteTours([{ _id: tourId }]);
      setList((prevList) => prevList.filter((tour) => tour._id !== tourId));
    } catch (error) {
      console.error("Failed to delete the tour:", error);
    }
  };

  const deleteSelectedTours = async () => {
    const selectedIds = getSelectedTours();
    if (selectedIds.length === 0) {
      alert("Please select tours to delete.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the selected tours?")
    ) {
      return;
    }

    try {
      const ids = selectedIds.map((c) => {
        return { _id: c };
      });
      await deleteTours(ids);
      navigate("/dashboard/manage-tour/tour");
    } catch (error) {
      console.error("Failed to delete selected tours:", error);
    }
  };

  return (
    <Container>
      <div className="tours-header d-flex justify-content-between align-items-center">
        <h1>Tours</h1>
        <div className="d-flex gap-2">
          <Link to="/dashboard/manage-tour/create-tour">
            <Button variant="success">Create</Button>
          </Link>
          <Button variant="danger" onClick={deleteSelectedTours}>
            Delete tours
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" variant="primary" />
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
              <th>Tour Name</th>
              <th>Price</th>
              <th>Features</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(list) && list.length === 0 ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
              >
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              list.map((tour) => (
                <tr key={tour._id} className="align-middle text-center">
                  <td className="text-truncate-column">
                    <input
                      type="checkbox"
                      checked={checkedTour[tour._id] || false}
                      onChange={(e) => handleCheckboxChange(e, tour._id)}
                    />
                  </td>
                  <td className="text-truncate-column">{tour.city}</td>
                  <td className="text-truncate-column">
                    Adult: ${tour.prices.adult}, Child: ${tour.prices.child}
                  </td>
                  <td className="d-flex gap-1 justify-content-center align-items-center">
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() =>
                        navigate(
                          `/dashboard/manage-tour/detail-tour/${tour._id}`
                        )
                      }
                    >
                      Detail
                    </Button>
                    <ButtonPage
                      color="primary"
                      text="Edit"
                      fun={() => editTour(tour._id)}
                    />
                    <ButtonPage
                      color="danger"
                      text="Delete"
                      fun={() => deleteTourById(tour._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
