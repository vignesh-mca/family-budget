import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./extra-income.scss";

import { extraIncomeType } from "../../utils/Utils";

import MainLayout from "../../layouts/mainLayout/MainLayout";
import InputFormGroup from "../../components/inputFormGroup/InputFormGroup";
import InputText from "../../components/inputText/InputText";
import InputSelect from "../../components/inputSelect/InputSelect";
import CustomDatepicker from "../../components/customDatepicker/CustomDatepicker";
import ModalWindow from "../../components/modalWindow/ModalWindow";

const ExtraIncome = () => {
  // State Object For DOB Field
  const [incomeDate, setIncomeDate] = useState("");

  // State Object For Income Month Start & End Date
  const [incomeMonthStartDate, setIncomeMonthStartDate] = useState("");
  const [incomeMonthEndDate, setIncomeMonthEndDate] = useState("");

  // State Object For Payment Type
  const [selectedCreditType, setSelectedCreditType] = useState("select");

  // State Obejct For Handling Extra Income Error
  const [extraIncomeErrors, setExtraIncomeErrors] = useState({});

  // Handle The Date Field On Change Function
  const handleIncomeDateChange = (date) => {
    console.log("Income Date", date);
    setIncomeDate(date);
    // date === null
    //   ? (userErrors.dob = "Please select dob")
    //   : delete userErrors.dob;
  };

  // State Object For Modal Window
  const [openModal, setOpenModal] = useState(false);

  // Show The Modal Window Screen
  const openModalWindow = () => {
    setOpenModal(true);
  };

  // Close The Modal Window Screen
  const closeModalWindow = () => {
    setOpenModal(false);
  };

  // Delete Extra-Income Information Data
  const deleteExtraIncomeData = (e) => {
    e.preventDefault();
    setOpenModal(false);
    alert("Data deleted successfully!");
  };

  return (
    <>
      <MainLayout title="Extra Income">
        <div className="extra-income-section">
          <Form>
            <Row>
              <Col>
                <InputFormGroup inputLabel="Income Date" inputName="incomeDate">
                  <CustomDatepicker
                    customDateChange={handleIncomeDateChange}
                    customdateName="incomeDate"
                    customDatePlaceholder="Please select DOB"
                    customMinDateRange={incomeMonthStartDate}
                    customMaxDateRange={incomeMonthEndDate}
                  />
                </InputFormGroup>

                <InputFormGroup
                  inputLabel="Amount Credited To:"
                  inputName="ddlAmountCreditType"
                >
                  <InputSelect
                    inputName="ddlAmountCreditType"
                    inputArray={extraIncomeType}
                    inputDefaultValue={selectedCreditType}
                    //   inputChange={handleSelectChange}
                    inputErrorMessage={extraIncomeErrors.selectedPaymentType}
                  />
                  <div className="input-hints">
                    <p>
                      <span>Note:</span> Please select type for amount credit
                      details.
                    </p>
                  </div>
                </InputFormGroup>

                <InputFormGroup
                  inputLabel="Credited Amount"
                  inputName="incomeCreditAmount"
                >
                  <InputText
                    inputName="incomeCreditAmount"
                    inputType="text"
                    placeholderName="Enter credited amount"
                    inputAlignment="right"
                    inputErrorMessage={extraIncomeErrors.incomeCreditAmount}
                    // inputChange={handleInputChange}
                    // inputBlur={resetDefaultValue}
                    // inputFocus={resetInput}
                    // inputValue={salaryDetails.bonusAmount}
                  />
                </InputFormGroup>

                <InputFormGroup
                  inputLabel="Description"
                  inputName="description"
                >
                  <textarea
                    className="form-control"
                    placeholder="Enter your hints here..."
                    name="description"
                    //   onChange={handleExpenseInputChange}
                    //   value={expenseData.description}
                  ></textarea>
                </InputFormGroup>

                <div className="form-group extra-income-section__action-content">
                  <button type="button" className="btn btn-success">
                    Save
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={openModalWindow}
                  >
                    Delete
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </MainLayout>
      <ModalWindow
        modalCustomClasses="extra-income-section__delete-modal"
        showModal={openModal}
        closeModal={closeModalWindow}
        modalTitle="Confirm Delete"
        modalBody="Are you sure you want to delete the extra income?"
        modalFooter={
          <button
            type="button"
            className="btn btn-danger"
            onClick={deleteExtraIncomeData}
          >
            Confirm
          </button>
        }
      />
    </>
  );
};

export default ExtraIncome;