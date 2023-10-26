import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TenantsHeader from "components/Headers/TenantsHeader";
import Cookies from "universal-cookie";
import { Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const TenantProperty = () => {
//   const { rental_adress } = useParams();
  const [rental_adress, setRentalAddress] = useState("")
  console.log(rental_adress);
  const [propertyDetails, setpropertyDetails] = useState({});
  const [propertyLoading, setpropertyLoading] = useState(true);
  const [propertyError, setpropertyError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log("this is mine rental address: ", rental_adress)

  //   mj tenant details
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  console.log(id, tenantDetails);

  let cookies = new Cookies();
  let cookie_id = cookies.get("Tenant ID");

  // let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let  authConfig = {
        headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        token: cookies.get("token"),
      },
    };
    // auth post method
    let res = await axios.post(
      "http://64.225.8.160:4000/register/auth",
      { purpose: "validate access" },
      authConfig
    );
    if (res.data.statusCode !== 200) {
      // cookies.remove("token");
      navigate("/auth/login");
    }
  } else {
    navigate("/auth/login");
  }
};

React.useEffect(() => {
  chackAuth();
}, [cookies.get("token")]);

  const getTenantData = async () => {
    try {
      const response = await axios.get(
        `http://64.225.8.160:4000/tenant/tenant_summary/${cookie_id}`
      );
    //   console.log(response.data.data.rental_adress, "this is my data");
      setTenantDetails(response.data.data);
      setRentalAddress(response.data.data.rental_adress)
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      // setError(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    getTenantData();
    // console.log(id)
  }, [id]);

  const navigate = useNavigate();

  const getRentalData = async () => {
    try {
      const response = await axios.get(
        `http://64.225.8.160:4000/rentals/rentals_property/${rental_adress}`
      );
      setpropertyDetails(response.data.data);
      setpropertyLoading(false);
    } catch (error) {
      setpropertyError(error);
      setpropertyLoading(false);
    }
  };
  useEffect(() => {
    if (rental_adress) {
        console.log(`http://64.225.8.160:4000/rentals/rentals_property/${rental_adress}`)
        getRentalData();
    }
    //console.log(rental_adress)
  }, [rental_adress]);

  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
              <CardHeader className="border-0">
                {/* <h3 className="mb-0">Summary </h3> */}
              </CardHeader>
              <div className="table-responsive">
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ width: "100%" }}
                >
                  {propertyLoading ? (
                    <tr>
                      <td>Loading property details...</td>
                    </tr>
                  ) : propertyError ? (
                    <tr>
                      <td>Error: {propertyError.message}</td>
                    </tr>
                  ) : propertyDetails.rental_adress ? (
                    <>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-lg" style={{color:'#3B2F2F'}}>
                            Property Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Image</td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                              }}
                            >
                              {propertyDetails.propertyres_image &&
                                propertyDetails.propertyres_image.length >
                                  0 && (
                                  <div
                                    style={{
                                      width: "100%", // Expands to full width by default
                                    }}
                                  >
                                    Residential:
                                    {propertyDetails.propertyres_image.map(
                                      (propertyres_image, index) => (
                                        <img
                                          key={index}
                                          src={propertyres_image}
                                          alt="Property Details"
                                          onClick={() => {
                                            setSelectedImage(propertyres_image);
                                            handleOpen();
                                          }}
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            // objectFit: "cover",
                                            margin: "10px",
                                            borderRadius: "10px",
                                            "@media (max-width: 768px)": {
                                              width: "100%", // Full-width on smaller screens
                                            },
                                          }}
                                        />
                                      )
                                    )}
                                    <Modal
                                      open={open}
                                      onClose={handleClose}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          backgroundColor: "white",
                                          border: "2px solid #000",
                                          padding: "2rem",
                                        }}
                                      >
                                        <img
                                          style={style}
                                          src={selectedImage}
                                          alt="Image"
                                        />
                                        <ClearIcon
                                          style={{
                                            cursor: "pointer",
                                            position: "absolute",
                                            top: "-99px",
                                            right: "-171px",
                                          }}
                                          onClick={handleClose}
                                        />
                                      </div>
                                    </Modal>
                                  </div>
                                )}
                              {propertyDetails.property_image &&
                                propertyDetails.property_image.length > 0 && (
                                  <div
                                    style={{
                                      width: "100%", // Expands to full width by default
                                    }}
                                  >
                                    Commercial:
                                    {propertyDetails.property_image.map(
                                      (property_image, index) => (
                                        <img
                                          key={index}
                                          src={property_image}
                                          alt="Property Details"
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            // objectFit: "cover",
                                            margin: "10px",
                                            borderRadius: "10px",
                                            "@media (max-width: 768px)": {
                                              width: "100%", // Full-width on smaller screens
                                            },
                                          }}
                                        />
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                        {/* <tr>
                          <td class="font-weight-bold text-md">Image</td>
                          <td>
                            <img
                              src={
                                propertyDetails.propertyres_image ||
                                propertyDetails.property_image
                              }
                              alt="Property Details"
                              style={{ maxWidth: "8rem" }}
                            />
                          </td>
                        </tr> */}
                        <tr>
                          <td class="font-weight-bold text-md">
                            Property Type
                          </td>
                          <td>{propertyDetails.property_type}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Address</td>
                          <td>{propertyDetails.rental_adress}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">City</td>
                          <td>{propertyDetails.rental_city}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Country</td>
                          <td>{propertyDetails.rental_country}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Postcode</td>
                          <td>{propertyDetails.rental_postcode}</td>
                        </tr>
                      </tbody>

                      <tbody>
                                                <tr>
                                                    <th colSpan="2" className="text-lg" style={{color:'#3B2F2F'}}>Rental Owner Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">First Name</td>
                                                    <td>{propertyDetails.rentalOwner_firstName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Last Name</td>
                                                    <td>{propertyDetails.rentalOwner_lastName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Company Name</td>
                                                    <td>{propertyDetails.rentalOwner_companyName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">E-Mail</td>
                                                    <td>{propertyDetails.rentalOwner_primaryEmail}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Phone Number</td>
                                                    <td>{propertyDetails.rentalOwner_phoneNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Home Number</td>
                                                    <td>{propertyDetails.rentalOwner_homeNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Business Number</td>
                                                    <td>{propertyDetails.rentalOwner_businessNumber}</td>
                                                </tr>
                                               
                                            </tbody>
                                            <tbody>
                                                <tr>
                                                    <th colSpan="2" className="text-lg" style={{color:'#3B2F2F'}}>Unit Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Unit</td>
                                                    <td>{propertyDetails.rental_units || propertyDetails.rentalcom_units}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Unit Address</td>
                                                    <td>{propertyDetails.rental_unitsAdress || propertyDetails.rentalcom_unitsAdress}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Bed</td>
                                                    <td>{propertyDetails.rental_bed}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Bath</td>
                                                    <td>{propertyDetails.rental_bath}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">SQFT</td>
                                                    <td>{propertyDetails.rental_soft || propertyDetails.rentalcom_soft}</td>
                                                </tr> 
                                                  
                                            </tbody> 


                    </>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No tenant details found.</td>
                      </tr>
                    </tbody>
                  )}
                </Table>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default TenantProperty;
