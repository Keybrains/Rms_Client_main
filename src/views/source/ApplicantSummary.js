import Header from "components/Headers/Header";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import HomeIcon from "@mui/icons-material/Home";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
} from "reactstrap";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import EmailIcon from "@mui/icons-material/Email";
import ClearIcon from "@mui/icons-material/Clear";
import {
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const ApplicantSummary = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  console.log(id, "id");
  const [selectedDropdownItem, setselectedDropdownItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = React.useState("Summary");
  const [searchText, setSearchText] = useState("");
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [applicantData, setApplicantData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [isEdit, setIsEdit] = useState(false);

  const handleSearch = () => {
    // Handle search functionality here
    console.log("Searching for:", searchText);
  };

  const handleAttachFile = () => {
    setIsAttachFile(true);
  };

  const handleClear = () => {
    setSearchText("");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dropdownList = [
    "Draft",
    "Undecided",
    "Approved",
    "Deferred",
    "Canceled",
    "Rejected",
  ];

  const selectedDropdown = (item) => {
    setselectedDropdownItem(item);
    console.log(item, "item");
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  const toggle = () => setIsOpen((prevState) => !prevState);
  // const id = useParams().id;

  const navigateToLease = () => {
    axios
      .get(`http://64.225.8.160:4000/api/applicant/applicant_summary/${id}`)
      .then((response) => {
        const data = response.data.data;

        // Extract the rental address from the response
        const rentalAddress = data.rental_adress;

        console.log(rentalAddress, "Rental Addressss");

        // Navigate to the leasing page with the rental address
        navigate(`/admin/RentRollLeaseing/${rentalAddress}`);
        console.log(`/admin/RentRollLeaseing/${rentalAddress}`, "fgbasfg");
      })
      .catch((err) => {
        console.error(err);
        // Handle errors here if needed
      });
  };

  useEffect(() => {
    axios
      .get(`http://64.225.8.160:4000/api/applicant/applicant_summary/${id}`)
      .then((applicants) => {
        axios
          .get("http://64.225.8.160:4000/api/rentals/property")
          .then((properties) => {
            console.log(applicants.data.data, "applicants");
            console.log(properties.data.data, "properties");
            setApplicantData(applicants.data.data);
            const allProperties = properties.data.data;
            const allApplicants = applicants.data.data;
            const matchedProperty = allProperties.find((property) => {
              return property.rental_adress === allApplicants.rental_adress;
            });
            setPropertyData(matchedProperty);
            console.log(matchedProperty, "matchedProperty");
            // navigate(`/admin/Leaseing/${id}/${matchedProperty._id}`);
            // console.log(response.data.data,'response.data.data');

            // setRentalsData(response.data.data);

            // setLoader(false);
          })
          .then((err) => {
            console.log(err);
            // setLoader(false);
          });
      })
      .then((err) => {
        console.log(err);
        // setLoader(false);
      });
  }, [id]);
  // const navigateToLease = () => {

  // }
  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const toggleChecklist = () => {
    setChecklistVisible(!isChecklistVisible);
  };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setChecklistItems([...checklistItems, newItem]);
      setNewItem(""); // Clear the input field
    }
  };

  const fetchDataAndPost = async () => {
    try {
      // Step 1: Fetch data from the API
      const response = await axios.get(
        `http://64.225.8.160:4000/api/applicant/applicant_summary/${id}`
      );

      // Check if the response contains the data you expect
      const fetchedData = response.data;
      console.log(fetchedData, "fetched data");
      if (fetchedData) {
        // Step 2: Create an object with the fetched data
        const dataToSend = {
          tenant_firstName: fetchedData.data.tenant_firstName,
          tenant_lastName: fetchedData.data.tenant_lastName,
          tenant_unitNumber: fetchedData.data.tenant_unitNumber,
          tenant_mobileNumber: fetchedData.data.tenant_mobileNumber,
          tenant_workNumber: fetchedData.data.tenant_workNumber,
          tenant_homeNumber: fetchedData.data.tenant_homeNumber,
          tenant_faxPhoneNumber: fetchedData.data.tenant_faxPhoneNumber,
          tenant_email: fetchedData.data.tenant_email,
          entries: [{ rental_adress: fetchedData.data.rental_adress }], // You can add logic to populate the entries array if needed
        };

        // Step 3: Make a POST request to send the data to the server
        const postResponse = await axios.post(
          "http://64.225.8.160:4000/api/tenant/tenant",
          dataToSend
        );
        console.log(dataToSend, "hagfjg");
        if (postResponse.status === 200) {
          console.log("Data posted successfully:", postResponse.data);
        } else {
          console.error(
            "Data post request failed. Status code:",
            postResponse.status
          );
          console.error(
            "Error message from the server:",
            postResponse.data.message
          );
        }
      } else {
        // Handle the case where the fetched data is not as expected
        console.error("Invalid data format received from the API");
      }
    } catch (error) {
      // Handle errors if either the GET or POST request fails
      console.error("Data fetch or post failed", error);
    }
  };

  useEffect(() => {
    fetchDataAndPost();
  }, [id]);

  return (
    <>
      <Header title="ApplicantSummary" />
      <Container className="mt--7" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Applicant Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/Applicants")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />

        <Paper elevation={2}>
          {/* <InputGroup>
            <Input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                border: "none",
              }}
            />
            <InputGroupAddon addonType="append">
              <Button
                color="secondary"
                onClick={handleSearch}
                style={{ marginLeft: "10px" }}
              >
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup> */}

          <div
            className="formInput d-flex flex-direction-row"
            style={{ margin: "30px 30px", paddingTop: "20px" }}
          >
            <Dropdown
              //   isOpen={selectAccountDropDown}
              //   toggle={toggle8}
              isOpen={isOpen}
              toggle={toggle}
            >
              <DropdownToggle caret style={{ width: "100%" }}>
                {selectedDropdownItem ? selectedDropdownItem : "Select"}
              </DropdownToggle>
              <DropdownMenu
                style={{ width: "100%" }}
                name="rent_cycle"
                //   onBlur={accountFormik.handleBlur}
                //   onChange={accountFormik.handleChange}
                //   value={accountFormik.values.account_type}
              >
                {dropdownList.map((item, index) => {
                  return (
                    <DropdownItem
                      key={index}
                      onClick={() => selectedDropdown(item)}
                    >
                      {item}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
            <Button
              style={
                selectedDropdownItem === "Approved"
                  ? { display: "block", marginLeft: "10px" }
                  : { display: "none" }
              }
              color="success"
              onClick={fetchDataAndPost} // Correctly bind the function
            >
              Move in
            </Button>
          </div>
          <Row>
            <Col>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Summary" value="Summary" />
                    {/* <Tab label="Application" value="Application" />
                    <Tab label="Screening" value="Screening" /> */}
                  </TabList>
                </Box>
                <TabPanel value="Summary">
                  <Row>
                    <Col>
                      <Grid container spacing={3}>
                        <Grid item xs={9}>
                          {isAttachFile ? (
                            <Card>
                              <CardBody>
                                <CardTitle tag="h4">Notes</CardTitle>
                                {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}
                                <textarea style={{ width: "100%" }}></textarea>

                                <input
                                  id="file"
                                  name="file"
                                  type="file"
                                  style={{ display: "none" }}
                                />
                                <label htmlFor="file">+ Attach file</label>

                                <div>
                                  <Button
                                    color="success"
                                    onClick={() => {
                                      setIsAttachFile(false);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setIsAttachFile(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </CardBody>
                              <ClearIcon
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "10px",
                                }}
                                onClick={() => {
                                  setIsAttachFile(false);
                                }}
                              />
                            </Card>
                          ) : (
                            <Button
                              onClick={() => {
                                handleAttachFile();
                              }}
                            >
                              Attach note or file
                            </Button>
                          )}
                          <div>
                            <Box display="flex" flexDirection="column">
                              <br></br>
                              {/* <FormControlLabel
                                control={
                                  <Checkbox
                                    id="checkbox1"
                                    color="success"
                                    name="checkbox1"
                                  />
                                }
                                label="CheckList 1"
                                style={{ marginTop: "0px" }}
                              /> */}
                              {checklistItems.map((item, index) => (
                                <div key={index}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        color="success"
                                        checked={false} // You can set the checked state as needed
                                      />
                                    }
                                    label={item}
                                  />
                                </div>
                              ))}
                            </Box>
                            {isChecklistVisible && (
                              <div>
                                <Box
                                  display="flex"
                                  sx={{ width: "50%" }}
                                  flexDirection="row"
                                  alignItems="center"
                                >
                                  <TextField
                                    type="text"
                                    size="small"
                                    fullWidth
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                  />
                                  <CheckIcon
                                    sx={{
                                      backgroundColor: "green",
                                      color: "white",
                                      width: "30px",
                                      height: "30px",
                                      marginLeft: "5px",
                                      cursor: "pointer",
                                    }}
                                    onClick={handleAddItem}
                                  />
                                  <CloseIcon
                                    sx={{
                                      backgroundColor: "red",
                                      color: "white",
                                      width: "30px",
                                      height: "30px",
                                      marginLeft: "5px",
                                    }}
                                  />
                                </Box>
                              </div>
                            )}
                            <Button
                              variant="body1"
                              sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={toggleChecklist}
                            >
                              + Add checklist
                            </Button>
                          </div>
                        </Grid>
                        <Grid item xs={3}>
                          {isEdit ? (
                            <Card>
                              <CardBody>
                                {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div>
                                    <h5>Name</h5>
                                  </div>
                                  <TextField
                                    type="text"
                                    size="small"
                                    placeholder="FirstName"
                                  />
                                  <TextField
                                    type="text"
                                    size="small"
                                    style={{ marginTop: "10px" }}
                                    placeholder="LastName"
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginTop: "10px",
                                  }}
                                >
                                  <div>
                                    <h5>Numbers</h5>
                                  </div>
                                  <TextField
                                    type="text"
                                    size="small"
                                    placeholder="Phone"
                                  />
                                  <TextField
                                    type="text"
                                    size="small"
                                    style={{ marginTop: "10px" }}
                                    placeholder="Business"
                                  />
                                  <TextField
                                    type="text"
                                    size="small"
                                    style={{ marginTop: "10px" }}
                                    placeholder="Home"
                                  />
                                  <TextField
                                    type="text"
                                    size="small"
                                    style={{ marginTop: "10px" }}
                                    placeholder="Fax"
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div style={{ marginTop: "10px" }}>
                                    <h5>Email</h5>
                                  </div>
                                  <TextField
                                    type="text"
                                    size="small"
                                    placeholder="Email"
                                  />
                                </div>

                                <div style={{ marginTop: "10px" }}>
                                  <Button
                                    color="success"
                                    onClick={() => {
                                      setIsEdit(false);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setIsEdit(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </CardBody>

                              {/* <Button
                              color="success"
                              onClick={() => {
                                setIsEdit(false);
                              }}
                              >
                              Save
                            </Button> */}
                            </Card>
                          ) : (
                            <Card sx={{ minWidth: 275 }}>
                              <CardContent>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontSize: 20 }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {applicantData?.tenant_firstName +
                                      " " +
                                      applicantData?.tenant_lastName}
                                  </Typography>
                                  <Typography
                                    // variant="h5"
                                    sx={{
                                      fontSize: 14,
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      color: "blue",
                                      marginLeft: "10px",
                                    }}
                                    onClick={() => {
                                      setIsEdit(true);
                                    }}
                                    // component="div"
                                  >
                                    Edit
                                  </Typography>
                                </div>
                                <Typography variant="caption">
                                  Applicant
                                </Typography>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: "10px",
                                  }}
                                >
                                  <Typography>
                                    <HomeIcon />
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {applicantData?.tenant_homeNumber || "N/A"}
                                  </Typography>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: "10px",
                                  }}
                                >
                                  <Typography>
                                    <BusinessCenterIcon />
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {applicantData?.tenant_workNumber || "N/A"}
                                  </Typography>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: "10px",
                                  }}
                                >
                                  <Typography>
                                    <PhoneAndroidIcon />
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {applicantData?.tenant_mobileNumber ||
                                      "N/A"}
                                  </Typography>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginTop: "10px",
                                  }}
                                >
                                  <Typography>
                                    <EmailIcon />
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 14, marginLeft: "10px" }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {applicantData?.tenant_email || "N/A"}
                                  </Typography>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Grid>
                      </Grid>
                    </Col>
                  </Row>
                </TabPanel>
              </TabContext>
            </Col>
          </Row>
        </Paper>
      </Container>
    </>
  );
};

export default ApplicantSummary;
