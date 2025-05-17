import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";

function DeleteModal({
  isOpen = false, // Default value for isOpen
  toggle = () => {}, // Default value for toggle
  title = "Confirm Action", // Default title
  body = "Are you sure?", // Default body
  onConfirm = () => {}, // Default onConfirm handler
  loadingDelete = false, // New prop to track loading state
}) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        <Button
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={loadingDelete}
        >
          {loadingDelete ? (
            <div>
              <Spinner size="sm" /> Deleting...
            </div>
          ) : (
            "Yes, delete it!"
          )}
        </Button>{" "}
        <Button color="secondary" onClick={toggle} disabled={loadingDelete}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteModal;
