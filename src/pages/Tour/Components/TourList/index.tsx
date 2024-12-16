import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonPage from "../../../../components/Button";
import TableList from "../../../../components/TableList";
import { TourListResponse } from "../../../../models/TourListResponse";
import { TourService } from "../../../../services/Tour";

export const TourList: FC = () => {
  const { getTours, deleteTours } = TourService();
  const [list, setList] = useState<TourListResponse[]>([]);
  const [checkedTour, setCheckedTour] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const query = new URLSearchParams(useLocation().search);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const fetchTours = async (cursor: string | null, direction: string) => {
    try {
      const page: any = await getTours(cursor, direction);
      setList(page.data.tours);
      setNextCursor(page.data.nextCursor);
      setPrevCursor(page.data.prevCursor);
      setCheckedTour({});
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    }
  };

  useEffect(() => {
    const cursorQuery = query.get("cursor");
    const directionQuery = query.get("direction") || "next";
    if (cursorQuery) {
      fetchTours(cursorQuery, directionQuery);
    } else {
      fetchTours(null, "next");
    }
  }, []);

  const pageNext = () => {
    if (nextCursor) {
      fetchTours(nextCursor, "next");
      navigate(
        `/dashboard/manage-tour/tour?cursor=${nextCursor}&direction=next`
      );
    }
  };

  const pagePrev = () => {
    if (prevCursor) {
      fetchTours(prevCursor, "prev");
      navigate(
        `/dashboard/manage-tour/tour?cursor=${prevCursor}&direction=prev`
      );
    }
  };

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
      const ids = selectedIds.map((id) => ({ _id: id }));
      await deleteTours(ids);
      setList((prevList) =>
        prevList.filter((tour) => !selectedIds.includes(tour._id))
      );
    } catch (error) {
      console.error("Failed to delete selected tours:", error);
    }
  };

  const tableData = list.map((tour) => (
    <tr key={tour._id} className="align-middle text-center">
      <td>
        <input
          type="checkbox"
          checked={checkedTour[tour._id] || false}
          onChange={(e) => handleCheckboxChange(e, tour._id)}
        />
      </td>
      <td>{tour.city || "N/A"}</td>
      <td>
        Adult: ${tour.prices?.adult || 0}, Child: ${tour.prices?.child || 0}
      </td>
      <td className="d-flex gap-1 justify-content-center align-items-center">
        <Button
          variant="info"
          className="me-2"
          onClick={() =>
            navigate(`/dashboard/manage-tour/detail-tour/${tour._id}`)
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
  ));

  return (
    <TableList
      title="Tours"
      create={
        <Link to="/dashboard/manage-tour/create-tour">
          <Button variant="success">Create</Button>
        </Link>
      }
      deletes={
        <Button variant="danger" onClick={deleteSelectedTours}>
          Delete tours
        </Button>
      }
      data={
        list.length === 0 ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
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
            <tbody>{tableData}</tbody>
          </Table>
        )
      }
      page={
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={pagePrev} disabled={!prevCursor}>
            Previous
          </Button>
          <Button variant="primary" onClick={pageNext} disabled={!nextCursor}>
            Next
          </Button>
        </div>
      }
    />
  );
};
