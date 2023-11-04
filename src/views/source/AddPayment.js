import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import swal from "sweetalert";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from "reactstrap";
import PaymentHeader from "components/Headers/PaymentHeader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { Check, CheckBox } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AddPayment = ({tenantDetails}) => {
  const {id} = useParams();
  const { rental_adress } = useParams();
  const [file, setFile] = useState([]);

  const [accountData, setAccountData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [prodropdownOpen, setproDropdownOpen] = useState(false);
  const [recdropdownOpen, setrecDropdownOpen] = useState(false);

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

  const [selectedProp, setSelectedProp] = useState("Select Payment Method");
  const handlePropSelection = (propertyType) => {
    setSelectedProp(propertyType);
  };
  
  const [selectedRec, setSelectedRec] = useState("Select Resident");
  const handleRecieverSelection = (propertyType) => {
    setSelectedRec(propertyType);
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }
  

  const generatePDF = async (tenantId, tenantDetails) => {
    try {
      let tenantData = tenantDetails;
      if (!tenantData || !tenantData._id) {
        const response = await axios.get(
          `https://propertymanager.cloudpress.host/api/Payment/Payment_summary/${tenantId}`
        );
        tenantData = response.data.data;
        console.log(tenantData, "tenantData");
      }

      const doc = new jsPDF();
      doc.text(`Lease Details`, 10, 10);

      const headers = ["Title", "Value"];
      const data = [
        ["Name",tenantData.tenant_firstName],
        ["Date",  formatDateWithoutTime(tenantData.date)],
        ["Amount", tenantData.amount],
        ["Payment Method", tenantData.payment_method],
        ["Memo", tenantData.memo],
        ["Account", tenantData.account],
        ["Balance", tenantData.balance],
        ["Amount", tenantData.amount],
        ["Total Amount", tenantData.total_amount],
      ];

      tenantData.upload_file.forEach((item, index) => {
        data.push([`Uploaded File ${index + 1}`, item]);
      });

      const filteredData = data.filter(
        (row) => row[1] !== undefined && row[1] !== null && row[1] !== ""
      );

      if (filteredData.length > 0) {
        doc.autoTable({
          head: [headers],
          body: filteredData,
          startY: 20,
        });
        
        doc.save(`${tenantId}.pdf`);
      } else {
        console.error("No valid data to generate PDF.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generalledgerFormik = useFormik({
    initialValues: {
      date: "",
      rental_adress: "",
      amount:"",
      payment_method:"",
      tenant_firstName:"",
      memo: "",
      entries: [
        {
          account: "",
          description: "",
          debit: "",
          credit: "",
          dropdownOpen: false,
        },
      ],
      attachment: "",
      total_amount: "",
    },
    validationSchema: yup.object({
      entries: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          balance: yup.number().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values, "values");
    },
  });

  let navigate = useNavigate();
  const handleCloseButtonClick = () => {
    navigate("../Payment");
  };

// useEffect(() => {
//     // Make an HTTP GET request to your Express API endpoint
//     fetch("https://propertymanager.cloudpress.host/api/tenant/tenant-name/tenant/${rental_adress}")
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.statusCode === 200) {
//           setPropertyData(data.data);
//           console.log(data.data, "gdasga");
//         } else {
//           // Handle error
//           console.error("Error:", data.message);
//         }
//       })
//       .catch((error) => {
//         // Handle network error
//         console.error("Network error:", error);
//       });
//   }, []);

const handleAccountSelection = (value, index) => {
    console.log('Selected index:', index);
  
    const updatedEntries = [...generalledgerFormik.values.entries];
    console.log('Current entries:', updatedEntries);
  
    if (updatedEntries[index]) {
      updatedEntries[index].account = value;
      generalledgerFormik.setValues({
        ...generalledgerFormik.values,
        entries: updatedEntries,
      });
    } else {
      console.error(`Invalid index: ${index}`);
    }
  }; 

  const handleAddRow = () => {
    const newEntry = {
      account: "",
      description: "",
      debit: "",
      credit: "",
      dropdownOpen: false,
    };
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: [...generalledgerFormik.values.entries, newEntry],
    });
  };

  const toggleDropdown = (index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries[index].dropdownOpen = !updatedEntries[index].dropdownOpen;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  const handleRemoveRow = (index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries.splice(index, 1); // Remove the entry at the specified index
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  useEffect(() => {
    fetch("https://propertymanager.cloudpress.host/api/addaccount/find_accountname")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setAccountData(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }, []);

  // Calculate the total debit and credit
  let totalDebit = 0;
  let totalCredit = 0;
  generalledgerFormik.values.entries.forEach((entries) => {
    if (entries.balance) {
      totalDebit += parseFloat(entries.balance);
    }
    if (entries.amount) {
      totalCredit += parseFloat(entries.amount);
    }
  });

  const handleSubmit = async (values) => {
    const arrayOfNames = file.map((item) => item.name);

    try {
      const updatedValues = {
        date: values.date,
        amount:values.amount,
        payment_method: selectedProp,
        tenant_firstName: selectedRec,
        attachment: arrayOfNames,
        
        entries: generalledgerFormik.values.entries.map((entry) => ({
          account: entry.account,
          balance: parseFloat(entry.balance),
          amount: parseFloat(entry.amount),
          total_amount: (totalDebit + totalCredit).toFixed(2),
        })),
      };

      const response = await axios.post(
        "https://propertymanager.cloudpress.host/api/payment/add_payment",
        updatedValues
      );

      if (response.data.statusCode === 200) {
        swal("Success","Payment Done Successfully!", "success");
        navigate("/admin/Payment");
        
      } else {
        swal("", response.data.message, "error");
        console.error("Server Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  const fileData = (files) => {
    //setImgLoader(true);
    // console.log(files, "file");
    const filesArray = [...files];

    if (filesArray.length <= 10 && file.length === 0) {
      setFile([...filesArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
    } else {
      setFile([...file, ...filesArray]);
    }

    // console.log(file, "fileanaadsaa");

    const dataArray = new FormData();
    dataArray.append("b_video", files);

    let url = "https://cdn.brandingprofitable.com/image_upload.php/";
    axios
      .post(url, dataArray, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        //setImgLoader(false);
        const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
        console.log(imagePath, "imagePath");
        // setFile(imagePath);
      })
      .catch((err) => {
        //setImgLoader(false);
        console.log("Error uploading image:", err);
      });
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
  };
  
  const handleOpenFile = (item) => {
    // console.log(file,"fike")
    // const fileToOpen = file.filter((file) => {
    //   return file.name === item.name
    // })
    // console.log(fileToOpen, "fileToOpen");
    console.log(item, "item");
    const url = URL.createObjectURL(item);
    window.open(url, "_blank");
  };

  return (
    <>
      <PaymentHeader />
      <style>
        {`
            .custom-date-picker {
            background-color: white;
            }
        `}
      </style>

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={generalledgerFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">New Payment</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="3000"
                          type="date"
                          name="date"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.date}
                        />
                        {generalledgerFormik.touched.date &&
                        generalledgerFormik.errors.date ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.date}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Amount
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="$0.00"
                          type="text"
                          name="amount"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.amount}
                        />
                        {generalledgerFormik.touched.amount &&
                        generalledgerFormik.errors.amount ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.amount}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Payment Method
                        </label>
                        <br />
                        <Dropdown isOpen={prodropdownOpen} toggle={toggle1}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedProp ? selectedProp : "Select Payment Method"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                                width: "100%",
                                maxHeight: "200px",
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                          >
                            <DropdownItem onClick={() =>handlePropSelection("Debit Card")}>Debit Card</DropdownItem>
                            <DropdownItem onClick={() =>handlePropSelection("Cash")}>Cash</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Recieved From
                        </label>
                        <br />
                        <Dropdown isOpen={recdropdownOpen} toggle={toggle2}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedRec ? selectedRec : "Select Resident"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                                width: "100%",
                                maxHeight: "200px",
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                          >
                                  <DropdownItem onClick={() =>handleRecieverSelection("Avi")}>Avi</DropdownItem>
                                  <DropdownItem onClick={() =>handleRecieverSelection("Mansi")}>Mansi</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Memo
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="if left blank, will show 'Payment'"
                          type="text"
                          name="memo"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.memo}
                        />
                        {generalledgerFormik.touched.memo &&
                        generalledgerFormik.errors.memo ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.memo}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                      <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Apply Payment to Balances
                        </label>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>Balance</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <>
                                {generalledgerFormik.values.entries.map(
                                  (entries, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Dropdown
                                          isOpen={entries.dropdownOpen}
                                          toggle={() => toggleDropdown(index)}
                                        >
                                          <DropdownToggle caret>
                                            {entries.account ? entries.account : "Select"}
                                          </DropdownToggle>
                                          <DropdownMenu
                                            style={{
                                              zIndex: 999,
                                              maxHeight: "200px",
                                              overflowY: "auto",
                                            }}
                                          >
                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Liability Account
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleAccountSelection("Last Month's Rent", index)}>Last Month's Rent</DropdownItem>
                                            <DropdownItem onClick={() =>handleAccountSelection("Prepayments",index)}>Prepayments</DropdownItem>
                                            <DropdownItem onClick={() =>handleAccountSelection("Security Deposit Liability",index)}>Security Deposit Liability</DropdownItem>

                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Income Account
                                            </DropdownItem>
                                            {accountData?.map((item) => (
                                              <DropdownItem
                                                key={item._id}
                                                onClick={() =>
                                                  handleAccountSelection(
                                                    item.account_name,
                                                    index
                                                  )
                                                }
                                              >
                                                {item.account_name}
                                              </DropdownItem>
                                            ))}
                                          </DropdownMenu>
                                        </Dropdown>
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="number"
                                          name={`entries[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.balance}
                                        />
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].balance ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].balance
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="number"
                                          name={`entries[${index}].amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.amount}
                                        />
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].amount
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      <td style={{ border: "none" }}>
                                        <ClearIcon
                                          type="button"
                                          style={{
                                            cursor: "pointer",
                                            padding: 0,
                                          }}
                                          onClick={() => handleRemoveRow(index)}
                                        >
                                          Remove
                                        </ClearIcon>
                                      </td>
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <th>Total</th>
                                  <th>{totalDebit.toFixed(2)}</th>
                                  <th>{totalCredit.toFixed(2)}</th>

                                </tr>
                              </>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="4">
                                  <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddRow}
                                  >
                                    Add Row
                                  </Button>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>

                        <div class="d-flex">
                          <div class="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                              multiple
                              onChange={(e) => fileData(e.target.files)}
                            />
                            <label for="upload_file" class="btn">
                              Choose Files
                            </label>

                            {generalledgerFormik.touched.attachment &&
                            generalledgerFormik.errors.attachment ? (
                              <div style={{ color: "red" }}>
                                {generalledgerFormik.errors.attachment}
                              </div>
                            ) : null}
                          </div>

                          <div className="d-flex ">
                            {file.length > 0 &&
                              file?.map((file, index) => (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    marginLeft: "50px",
                                  }}
                                >
                                  <p
                                    onClick={() => handleOpenFile(file)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file?.name?.substr(0, 5)}
                                    {file?.name?.length > 5 ? "..." : null}
                                  </p>
                                  <CloseIcon
                              style={{
                                cursor: "pointer",
                                position: "absolute",
                                left: "64px",
                                top: "-2px",
                              }}
                              onClick={() => deleteFile(index)}
                            />
                                </div>
                              ))}
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <Checkbox/>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                            Print Receipt
                        </label>  
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                      <Button
                        type="submit"
                        className="btn btn-primary"
                        style={{ background: "green", color: "white" }}
                        onClick={(e) => {
                          e.preventDefault();
                          generalledgerFormik.handleSubmit();
                          console.log(tenantDetails); 
                          //generatePDF(tenantDetails._id); // Pass the _id of the record
                        }}
                      >
                        Save Payment
                      </Button>

                        <Button
                          color="primary"
                          href="#rms"
                          className="btn btn-primary"
                          onClick={handleCloseButtonClick}
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddPayment;
