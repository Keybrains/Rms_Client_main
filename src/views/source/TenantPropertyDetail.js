import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader } from "reactstrap";
import TenantsHeader from "components/Headers/TenantsHeader";
import { FormGroup, Col, Button } from "reactstrap";

const TenantPropertyDetail = () => {
  const { rental_adress } = useParams();
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getRentalData = async () => {
      try {
        //const encodedAddress = encodeURIComponent(rental_adress);
        const url = `http://64.225.8.160:4000/rentals/Rentals_summary/tenant/${rental_adress}`;

        const response = await axios.get(url);
        setPropertyDetails(response.data.data);
        console.log(response.data.data);
        setPropertyLoading(false);
      } catch (error) {
        setPropertyError(error);
        setPropertyLoading(false);
      }
    };

    getRentalData();
  }, [rental_adress]);

  return (
    <>
      <TenantsHeader />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/tenant/tenantproperty")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Summary</h3>
              </CardHeader>
              <div className="table-responsive">
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ width: "100%" }}
                >
                  {propertyDetails.map((propertyDetails) => (
                    <>
                      <tbody>
                        <tr>
                          <th colSpan="2" className="text-lg" style={{color:"#3B2F2F"}}>
                            Property Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Image</td>
                          <td>
                            <img
                              src={
                                propertyDetails.entries.propertyres_image ||
                                propertyDetails.entries.property_image
                              }
                              alt="Property Details"
                              style={{ maxWidth: "8rem" }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Property Type
                          </td>
                          <td>{propertyDetails.entries.property_type || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Address</td>
                          <td>{propertyDetails.entries.rental_adress || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">City</td>
                          <td>{propertyDetails.entries.rental_city || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Country</td>
                          <td>{propertyDetails.entries.rental_country || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Postcode</td>
                          <td>{propertyDetails.entries.rental_postcode || "N/A"}</td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                        <th colSpan="2" className="text-lg" style={{color:"#3B2F2F"}}>
                            Rental Owner Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            First Name
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_firstName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Last Name
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_lastName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Company Name
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_companyName || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">E-Mail</td>
                          <td>
                            {propertyDetails.rentalOwner_primaryEmail || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Phone Number
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_phoneNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Home Number
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_homeNumber || "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Business Number
                          </td>
                          <td>
                            {propertyDetails.rentalOwner_businessNumber ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                        <th colSpan="2" className="text-lg" style={{color:"#3B2F2F"}}>
                            Account Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Operating Account
                          </td>
                          <td>
                            {propertyDetails.entries.rentalOwner_operatingAccount ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Property Reserve
                          </td>
                          <td>
                            {propertyDetails.entries.rentalOwner_propertyReserve ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                        <th colSpan="2" className="text-lg" style={{color:"#3B2F2F"}}>
                            Staff Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Staff Member
                          </td>
                          <td>{propertyDetails.entries.staffMember || "N/A"}</td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                        <th colSpan="2" className="text-lg" style={{color:"#3B2F2F"}}>
                            Unit Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Unit</td>
                          <td>
                            {propertyDetails.entries.rental_units ||
                              propertyDetails.entries.rentalcom_units ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Unit Address
                          </td>
                          <td>
                            {propertyDetails.entries.rental_unitsAdress ||
                              propertyDetails.entries.rentalcom_unitsAdress ||
                              "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Bed</td>
                          <td>{propertyDetails.entries.rental_bed || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Bath</td>
                          <td>{propertyDetails.entries.rental_bath || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">SQFT</td>
                          <td>
                            {propertyDetails.entries.rental_soft ||
                              propertyDetails.entries.rentalcom_soft ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ))}
                </Table>
              </div>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default TenantPropertyDetail;
