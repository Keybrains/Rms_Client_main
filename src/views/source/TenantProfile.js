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

const TenantProfile = () => {
  const { id } = useParams();
  console.log(id);
  const [tenantDetails, setTenantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // let rentalId = localStorage.getItem("ID")
  let cookies = new Cookies();
  let cookie_id = cookies.get("Tenant ID");

  //   let cookies = new Cookies();
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
      console.log(response.data.data);
      setTenantDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenantData();
    console.log(id);
  }, [id]);

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
                  {loading ? (
                    <tr>
                      <td>Loading tenant details...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td>Error: {error.message}</td>
                    </tr>
                  ) : tenantDetails._id ? (
                    <>
                      <tbody>
                        <tr>
                          <th
                            colSpan="2"
                            className="text-lg"
                            style={{ color: "#3B2F2F" }}
                          >
                            Personal Details
                          </th>
                        </tr>
                        {/* <tr>
                                                    <td class="font-weight-bold text-md">ID:</td>
                                                    <td>{tenantDetails._id}</td>
                                                </tr> */}
                        <tr>
                          <td class="font-weight-bold text-md">First Name:</td>
                          <td>{tenantDetails.tenant_firstName}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Last Name:</td>
                          <td>{tenantDetails.tenant_lastName}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Phone:</td>
                          <td>{tenantDetails.tenant_mobileNumber}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Email:</td>
                          <td>{tenantDetails.tenant_email}</td>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr>
                          <th
                            colSpan="2"
                            className="text-lg"
                            style={{ color: "#3B2F2F" }}
                          >
                            Lease Details
                          </th>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">
                            Property Type:
                          </td>
                          <td>{tenantDetails.rental_adress}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Lease Type:</td>
                          <td>{tenantDetails.lease_type}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Start Date:</td>
                          <td>{tenantDetails.start_date}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">End Date:</td>
                          <td>{tenantDetails.end_date}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Rent Cycle:</td>
                          <td>{tenantDetails.rent_cycle}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Rent Amount:</td>
                          <td>{tenantDetails.amount}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">Account:</td>
                          <td>{tenantDetails.account}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold text-md">
                            Next Due Date:
                          </td>
                          <td>{tenantDetails.nextDue_date}</td>
                        </tr>
                        {/* <tr>
                                                    <td class="font-weight-bold text-md">Memo:</td>
                                                    <td>{tenantDetails.memo}</td>
                                                </tr> */}
                      </tbody>

                      {/* <tbody>
                                                <tr>
                                                    <th colSpan="2" className="text-lg" style={{color:'#3B2F2F'}}>Co-signer Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">First Name:</td>
                                                    <td>{tenantDetails.cosigner_firstName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Last Name:</td>
                                                    <td>{tenantDetails.cosigner_lastName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Mobile Number:</td>
                                                    <td>{tenantDetails.cosigner_mobileNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Work Number:</td>
                                                    <td>{tenantDetails.cosigner_workNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Home Number:</td>
                                                    <td>{tenantDetails.cosigner_homeNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Fax Number:</td>
                                                    <td>{tenantDetails.cosigner_faxPhoneNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Email:</td>
                                                    <td>{tenantDetails.cosigner_email}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Alternate Email:</td>
                                                    <td>{tenantDetails.cosigner_alternateemail}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Street Address:</td>
                                                    <td>{tenantDetails.cosigner_streetAdress}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">City:</td>
                                                    <td>{tenantDetails.cosigner_city}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">State:</td>
                                                    <td>{tenantDetails.cosigner_state}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Country:</td>
                                                    <td>{tenantDetails.cosigner_country}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Postal Code:</td>
                                                    <td>{tenantDetails.cosigner_postalcode}</td>
                                                </tr>
                                            </tbody> */}

                      {/* <tbody>
                                                <tr>
                                                    <th colSpan="2" className="text-lg" style={{color:'#3B2F2F'}}>Recurring Payment Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Amount:</td>
                                                    <td>{tenantDetails.recuring_amount}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Account:</td>
                                                    <td>{tenantDetails.recuring_account}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Next Due Date:</td>
                                                    <td>{tenantDetails.recuringnextDue_date}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Memo:</td>
                                                    <td>{tenantDetails.recuringmemo}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Frequency:</td>
                                                    <td>{tenantDetails.recuringfrequency}</td>
                                                </tr>
                                            </tbody> */}

                      {/* <tbody>
                                                <tr>
                                                    <th colSpan="2" className="text-lg" style={{color:'#3B2F2F'}}>One-time Payment Details</th>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Amount:</td>
                                                    <td>{tenantDetails.onetime_amount}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Account:</td>
                                                    <td>{tenantDetails.onetime_account}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Due Date:</td>
                                                    <td>{tenantDetails.onetime_Due_date}</td>
                                                </tr>
                                                <tr>
                                                    <td class="font-weight-bold text-md">Memo:</td>
                                                    <td>{tenantDetails.onetime_memo}</td>
                                                </tr>
                                            </tbody> */}
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

export default TenantProfile;
