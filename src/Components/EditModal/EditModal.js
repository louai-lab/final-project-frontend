import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const EditModal = ({
  isOpen,
  toggle,
  title,
  data,
  onConfirm,
  fields,
  loadingUpdate = false,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  //   console.log("formdata", formData);

  const handleChange = (e, field) => {
    // console.log("E", e);
    if (field.type === "select") {
      setFormData((prevData) => ({
        ...prevData,
        [field.id]: e || null,
      }));
    } else if (field.type === "file") {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        [field.id]: file,
        [`${field.id}Preview`]: URL.createObjectURL(file),
      }));
    } else {
      const { id, type, checked, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : type === "date"
            ? new Date(value)
            : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = fields.every((field) => {
      if (
        (field?.id === "checkNb" || field?.id === "dueDate") &&
        formData?.isCheck?.id === 0
      ) {
        return true;
      }

      return (
        field?.id === "team" ||
        field.id === "image" ||
        field?.id === "barcode" ||
        field?.type === "checkbox" ||
        formData[field?.id]
      );
    });

    if (!isValid) {
      //   showToast(NotificationTypes.ERROR, "Error", "All Fields are required");
      console.log("All field are required");
      return;
    }

    const updatedData = { ...data, ...formData };
    // console.log("before", updatedData);
    onConfirm(updatedData);
  };

  // console.log("in edit", data);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} tag="h4">
        {title}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {fields.map((field) => {
            // console.log("ww", field);
            if (
              (field?.id === "checkNb" || field.id === "dueDate") &&
              formData?.isCheck?.id === 0
            ) {
              return null;
            }
            return (
              <FormGroup key={field.id} check={field.type === "checkbox"}>
                <Label for={field.id}>{field.label}</Label>

                {field.type === "select" ? (
                  <Select
                    value={formData[field.id] || null}
                    onChange={(e) => handleChange(e, field)}
                    options={field.options || []}
                    getOptionLabel={(option) => {
                      const parts = [
                        option?.name ? option?.name : null,
                        option?.description ? option?.description : null,
                        option?.accountNumber ? option?.accountNumber : null,
                        option?.currency ? option?.currency : null,
                        option?.barcode ? option?.barcode : null,
                      ].filter(Boolean);

                      return parts.join(" - ");
                    }}
                    placeholder={`Select ${field.label}`}
                    isClearable
                    isLoading={field.loading}
                    loadingMessage={() => `Loading...`}
                  />
                ) : field.type === "checkbox" ? (
                  <Input
                    key={`${field.id}-${formData[field.id]}`}
                    type="checkbox"
                    name={field.id}
                    id={field.id}
                    defaultChecked={formData[field.id] || false}
                    onChange={(e) => handleChange(e, field)}
                    placeholder={`Select ${field.label}`}
                  />
                ) : field.type === "date" ? (
                  <Flatpickr
                    className="form-control"
                    value={formData[field.id] || ""}
                    onChange={(selectedDates) => {
                      const [clientDate] = selectedDates;
                      setFormData((prevData) => ({
                        ...prevData,
                        [field.id]: clientDate,
                      }));
                    }}
                    options={{
                      enableTime: true,
                      dateFormat: "Y-m-d h:i K",
                      time_24hr: false,
                    }}
                    placeholder={`Select ${field.label}`}
                  />
                ) : field.type === "file" ? (
                  // <>
                  //   {formData[`${field.id}Preview`] || formData[field.id] ? (
                  //     <img
                  //       src={
                  //         formData[`${field.id}Preview`] ||
                  //         (typeof formData[field.id] === "string"
                  //           ? formData[field.id] // Assuming it's a URL from the DB
                  //           : "")
                  //       }
                  //       alt="preview"
                  //       style={{
                  //         width: "100px",
                  //         height: "100px",
                  //         objectFit: "cover",
                  //         marginBottom: "10px",
                  //       }}
                  //     />
                  //   ) : null}
                  //   <Input
                  //     type="file"
                  //     name={field.id}
                  //     id={field.id}
                  //     accept="image/*"
                  // onChange={(e) => handleChange(e, field)}
                  //   />
                  // </>
                  <>
                    <Input
                      type="file"
                      id={field.id}
                      // onChange={(e) => {
                      //   const file = e.target.files[0];
                      //   setFieldValues((prev) => ({
                      //     ...prev,
                      //     [field.id]: file,
                      //   }));
                      // }}
                      onChange={(e) => handleChange(e, field)}
                      accept="image/*"
                    />
                    {/* {formData[field.id] && (
                      <img
                        src={URL.createObjectURL(formData[field.id])}
                        alt="Preview"
                        style={{ marginTop: "10px", maxHeight: "150px" }}
                      />
                    )} */}
                  </>
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.id}
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(e, field)}
                    required
                    placeholder={`Enter ${field.label}`}
                  />
                )}
              </FormGroup>
            );
          })}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          style={{ backgroundColor: "var(--primary-clr)" }}
          onClick={handleSubmit}
          disabled={loadingUpdate}
        >
          {loadingUpdate ? (
            <div>
              <Spinner size="sm" /> Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
