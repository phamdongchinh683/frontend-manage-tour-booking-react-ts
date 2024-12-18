import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonPage from "../../../../components/Button";
import TableList from "../../../../components/TableList";
import { IBookingList } from "../../../../models/BookingList";
import { BookTourService } from "../../../../services/BookTour";

export const BookTourList: FC = () => {
  const { getBookTours, deleteBookTours } = BookTourService();
  const [list, setList] = useState<IBookingList[]>([]);
  const [checkedBooking, setCheckedBooking] = useState<{
    [key: string]: boolean;
  }>({});
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const query = new URLSearchParams(useLocation().search);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const fetchBooking = async (cursor: string | null, direction: string) => {
    try {
      const page: any = await getBookTours(cursor, direction);
      setList(page.bookingList);
      setNextCursor(page.nextCursor);
      setPrevCursor(page.prevCursor);
      setCheckedBooking({});
    } catch (error) {
      console.error("Failed to fetch Booking:", error);
    }
  };

  useEffect(() => {
    const cursorQuery = query.get("cursor");
    const directionQuery = query.get("direction") || "next";
    if (cursorQuery) {
      fetchBooking(cursorQuery, directionQuery);
    } else {
      fetchBooking(null, "next");
    }
  }, []);

  const pageNext = () => {
    if (nextCursor) {
      fetchBooking(nextCursor, "next");
      navigate(
        `/dashboard/manage-book-tour/book-tour-list?cursor=${nextCursor}&direction=next`
      );
    }
  };

  const pagePrev = () => {
    if (prevCursor) {
      fetchBooking(prevCursor, "prev");
      navigate(
        `/dashboard/manage-book-tour/book-tour-list?cursor=${prevCursor}&direction=prev`
      );
    }
  };

  const updateCheckedState = (updatedState: { [key: string]: boolean }) => {
    setCheckedBooking(updatedState);
    setSelectAll(Object.values(updatedState).every(Boolean));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    bookingId: string
  ) => {
    updateCheckedState({ ...checkedBooking, [bookingId]: e.target.checked });
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedState = Object.fromEntries(
      list.map((booking) => [booking._id, isChecked])
    );
    updateCheckedState(updatedState);
  };

  const getSelectedBooking = () => {
    return Object.keys(checkedBooking).filter(
      (bookingId) => checkedBooking[bookingId]
    );
  };

  const editBooking = (bookingId: string) => {
    navigate(`/dashboard/manage-book-tour/edit-book-tour/${bookingId}`, {
      state: { bookingId },
    });
  };

  const deleteBookingById = async (bookingId: string) => {
    const selectedIds = getSelectedBooking();
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      await deleteBookTours([{ _id: bookingId }]);
      const updatedList = list.filter(
        (booking) => !selectedIds.includes(booking._id)
      );
      setList(updatedList);
      if (updatedList.length === 0 && prevCursor) {
        fetchBooking(prevCursor, "prev");
        navigate(
          `/dashboard/manage-book-tour/book-tour-list?cursor=${prevCursor}&direction=prev`
        );
      }
    } catch (error) {
      console.error("Failed to delete the booking:", error);
    }
  };

  const deleteSelectedBooking = async () => {
    const selectedIds = getSelectedBooking();
    if (selectedIds.length === 0) {
      alert("Please select booking to delete.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the selected Booking?")
    ) {
      return;
    }

    try {
      const ids: any = selectedIds.map((id) => ({ _id: id }));
      await deleteBookTours(ids);

      const updatedList = list.filter(
        (booking) => !selectedIds.includes(booking._id)
      );
      setList(updatedList);

      if (updatedList.length === 0 && prevCursor) {
        fetchBooking(prevCursor, "prev");
        navigate(
          `/dashboard/manage-book-tour/book-tour-list?cursor=${prevCursor}&direction=prev`
        );
      }
    } catch (error) {
      console.error("Failed to delete selected Booking:", error);
    }
  };

  const tableData = list.map((booking: any) => (
    <tr key={booking._id} className="align-middle text-center">
      <td>
        <input
          type="checkbox"
          checked={checkedBooking[booking._id] || false}
          onChange={(e) => handleCheckboxChange(e, booking._id)}
        />
      </td>
      <th>{booking.tour_id?.city}</th>
      <th>
        {booking.user_id?.fullName.firstName}
        {booking.user_id?.fullName.lastName}
      </th>
      <th>
        {booking.guide_id?.fullName.firstName}
        {booking.guide_id?.fullName.lastName}
      </th>
      <th>{booking.number_visitors}</th>
      <th>{booking.start_tour}</th>
      <th>
        Start: {booking.time.start_time} - End: {booking.time.end_time}
      </th>
      <td className="d-flex gap-1 justify-content-center align-items-center">
        <Button
          variant="info"
          className="me-2"
          onClick={() =>
            navigate(
              `/dashboard/manage-book-tour/detail-book-tour/${booking._id}`
            )
          }
        >
          Detail
        </Button>
        <ButtonPage
          color="primary"
          text="Edit"
          fun={() => editBooking(booking._id)}
        />
        <ButtonPage
          color="danger"
          text="Delete"
          fun={() => deleteBookingById(booking._id)}
        />
      </td>
    </tr>
  ));

  return (
    <TableList
      title="Book tours"
      create={
        <Link to="/dashboard/manage-book-tour/create-book-tour">
          <Button variant="success">Create</Button>
        </Link>
      }
      deletes={
        <Button variant="danger" onClick={deleteSelectedBooking}>
          Delete Booking
        </Button>
      }
      data={
        list.length === 0 ? (
          <div
            className="d-flex justify-content-center align-items-center gap-2"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" variant="primary" />

            <span>There are currently no tour books available</span>
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
                <th>Tour</th>
                <th>User</th>
                <th>Guide</th>
                <th>Number of visitors</th>
                <th>startTour</th>
                <th>Time</th>
                <th>Feature</th>
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
