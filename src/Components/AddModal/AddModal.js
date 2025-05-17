import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectMui from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

function AddModal({
  isOpen = false,
  toggle = () => {},
  title = "Add New Item",
  onConfirm = () => {},
  buttonTitle = "Add Item",
  fields = [],
  loadingAdd = false,
}) {
  const [fieldValues, setFieldValues] = useState(() =>
    fields.reduce((acc, field) => {
      acc[field.id] =
        field.type === "checkbox" ? false : field.defaultValue || "";
      return acc;
    }, {})
  );

  useEffect(() => {
    if (!isOpen) {
      const resetValues = fields?.reduce((acc, field) => {
        acc[field?.id] =
          field?.type === "checkbox" ? false : field.defaultValue || "";
        return acc;
      }, {});

      const isDifferent = Object.keys(resetValues).some(
        (key) => resetValues[key] !== fieldValues[key]
      );

      if (isDifferent) {
        setFieldValues(resetValues);
      }
    }
  }, [isOpen, fields, fieldValues]);

  const handleFieldChange = (e) => {
    const { id, type, checked, value } = e.target;

    setFieldValues((prevValues) => ({
      ...prevValues,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value) || ""
          : value,
    }));
  };

  const handleSelectChange = (selectedOption, fieldId) => {
    // console.log("selectedOption", selectedOption);
    setFieldValues((prevValues) => ({
      ...prevValues,
      // [fieldId]: selectedOption ? selectedOption.id : null,
      [fieldId]: selectedOption || null,
    }));
  };

  const handleDateChange = (selectedDates, fieldId) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [fieldId]: selectedDates[0],
    }));
  };

  const handleAddItem = async () => {
    const isValid = fields.every((field) => {
      if (
        (field.id === "checkNb" || field.id === "dueDate") &&
        fieldValues?.isCheck?.id === 0
      ) {
        return true;
      }

      return (
        field.id === "team" ||
        field.id === "barcode" ||
        field.type === "checkbox" ||
        fieldValues[field.id]
      );
    });

    if (isValid) {
      await onConfirm(fieldValues);
    } else {
      //   showToast(NotificationTypes.ERROR, "Error", "All Fields are required");
      console.log("all required");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={fields.length > 4 ? "wide-modal" : ""}
    >
      <ModalHeader toggle={toggle} tag="h4">
        {title}
      </ModalHeader>
      <ModalBody>
        <div
          className={`input-container ${
            fields.length > 8 ? "grid-layout" : "stacked-layout"
          }`}
        >
          {fields.map((field) => {
            if (
              (field.id === "checkNb" || field.id === "dueDate") &&
              fieldValues?.isCheck?.id === 0
            ) {
              return null;
            }

            return (
              <FormGroup key={field.id} check={field.type === "checkbox"}>
                <Label for={field.id}>{field.label}</Label>
                {field.type === "select" ? (
                  field.isMulti ? (
                    <FormControl fullWidth>
                      <InputLabel id={`${field.id}-label`}>
                        {field.label}
                      </InputLabel>
                      <SelectMui
                        labelId={`${field.id}-label`}
                        multiple
                        value={fieldValues[field.id] || []}
                        onChange={(e) => {
                          setFieldValues((prev) => ({
                            ...prev,
                            [field.id]: e.target.value,
                          }));
                        }}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((item) => (
                              <Chip
                                key={item.id || item._id || item}
                                label={item.name || item}
                              />
                            ))}
                          </Box>
                        )}
                        label={field.label}
                      >
                        {field.options.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </SelectMui>
                    </FormControl>
                  ) : (
                    <Select
                      key={field.id}
                      id={field.id}
                      value={fieldValues[field.id] || null}
                      onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, field.id)
                      }
                      options={field.options || []}
                      getOptionLabel={(option) => {
                        if (!option) return "";
                        const parts = [
                          option?.name,
                          option?.accountNumber,
                          option?.currency,
                          option?.idUnit?.description,
                        ].filter(Boolean);
                        return parts.join(" - ");
                      }}
                      getOptionValue={(option) => option.id}
                      placeholder={`Select ${field.label}`}
                      isClearable
                      isLoading={field.loading}
                      loadingMessage={() => `Loading...`}
                      isMulti={field.isMulti}
                    />
                  )
                ) : field.type === "date" ? (
                  <Flatpickr
                    className="form-control"
                    id={field.id}
                    value={fieldValues[field.id]}
                    onChange={(selectedDates) => {
                      handleDateChange(selectedDates, field.id);
                    }}
                    options={{
                      enableTime: true,
                      dateFormat: "Y-m-d h:i K",
                      time_24hr: false,
                    }}
                    placeholder="Y-m-d"
                  />
                ) : field.type === "file" ? (
                  <>
                    <Input
                      type="file"
                      id={field.id}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFieldValues((prev) => ({
                          ...prev,
                          [field.id]: file,
                        }));
                      }}
                      accept="image/*"
                    />
                    {fieldValues[field.id] && (
                      <img
                        src={URL.createObjectURL(fieldValues[field.id])}
                        alt="Preview"
                        style={{ marginTop: "10px", maxHeight: "150px" }}
                      />
                    )}
                  </>
                ) : (
                  <Input
                    type={field.type || "text"}
                    id={field.id}
                    value={fieldValues[field.id] || ""}
                    onChange={handleFieldChange}
                    placeholder={`Enter ${field.label}`}
                    required
                    step="any"
                  />
                )}
              </FormGroup>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          style={{ backgroundColor: "var(--primary-clr)" }}
          onClick={handleAddItem}
          disabled={loadingAdd}
        >
          {loadingAdd ? (
            <div>
              <Spinner size="sm" /> Adding...
            </div>
          ) : (
            buttonTitle
          )}
        </Button>{" "}
        <Button color="secondary" onClick={toggle} disabled={loadingAdd}>
          Cancel
        </Button>
      </ModalFooter>

      <style>
        {`
          .input-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .grid-layout {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }

          .wide-modal {
            max-width: 800px !important; 
          }
        `}
      </style>
    </Modal>
  );
}

export default AddModal;
