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

const TenantProperty = () => {
  const [rental_adress, setRentalAddress] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);
  const [tenantDetails, setTenantDetails] = useState({});
  const { id } = useParams();
  // console.log(id, tenantDetails);
  
  let cookies = new Cookies();
  let cookie_id = cookies.get("Tenant ID");
  //let cookie_email = cookies.get("Tenant email");
  // let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "http://64.225.8.160:4000/api/register/auth",
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
        `http://64.225.8.160:4000/api/tenant/tenant_rental_addresses/${cookie_id}`
      );

      if (response.data && response.data.rental_adress) {
        setTenantDetails(response.data.data);
        setRentalAddress(response.data.rental_adress);
      } else {
        console.error("Data structure is not as expected:", response.data);
        setRentalAddress([]); // Set rental_adress to an empty array
      } 
    }catch (error) {
        console.error("Error fetching tenant details:", error);
        setRentalAddress([]); // Set rental_adress to an empty array
        setPropertyError(error);
      } finally {
        setPropertyLoading(false);
      }
    };

  useEffect(() => {
    getTenantData();
    console.log(
      `http://64.225.8.160:4000/api/tenant/tenant_rental_addresses/${cookie_id}`
    );
  }, [cookie_id]);

  const navigate = useNavigate();

  // const getRentalData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://64.225.8.160:4000/api/rentals/rentals_property/${rental_adress}`
  //     );
  //     setpropertyDetails(response.data.data);
  //     setpropertyLoading(false);
  //   } catch (error) {
  //     setpropertyError(error);
  //     setpropertyLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (rental_adress) {
  //       console.log(`http://64.225.8.160:4000/api/rentals/rentals_property/${rental_adress}`)
  //       getRentalData();
  //   }
  //   //console.log(rental_adress)
  // }, [rental_adress]);

  function navigateToTenantsDetails(rental_adress) {
    const tenantsDetailsURL = `/tenant/tenantpropertydetail/${rental_adress}`;
    window.location.href = tenantsDetailsURL;
    console.log("Rental Address", rental_adress);
  }
  return (
    <>
      <TenantsHeader />
      {/* Page content */}
      <Container className="mt--6 ml--10" fluid>
        <Row>
          <div className="col">
            <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
              <CardHeader className="border-0">
                <h1 className="mb-0">Properties</h1>
              </CardHeader>
              <div className="table-responsive">
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{
                    width: "100%",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {rental_adress.length > 0 ? (
                    <tbody>
                      {rental_adress.map((address, index) => (
                        <tr
                          key={address}
                          onClick={() => navigateToTenantsDetails(address)}
                          style={{ cursor: "pointer" }}
                        >
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #e5e5e5",
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                              textAlign: "center",
                            }}
                          >
                            <Button
                              style={{
                                backgroundColor: "#3B2F2F",
                                color: "white",
                                padding: "20px",
                                paddingRight: "50px",
                                paddingLeft: "50px",
                                marginTop: "10px",
                                marginBottom: "10px",
                                width: "100%",
                                maxWidth: "300px", 
                              }}
                            >
                              {address}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "0 0 8px 8px",
                          }}
                        >
                          No rental addresses found for the tenant.
                        </td>
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
