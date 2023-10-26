import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Button,
  Input,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "components/Headers/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; // Import sweetalert
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { RotatingLines } from "react-loader-spinner";
import Cookies from 'universal-cookie';
// import RentRollHeader from "components/Headers/RentRollHeader";

const RentRoll = () => {
  const [tenantsData, setTenantsData] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  let [loader, setLoader] = React.useState(true);

  function navigateToRentRollDetails(rentRollId) {
    const rentRollDetailsURL = `/admin/rentrolldetail/${rentRollId}`;
    window.location.href = rentRollDetailsURL;
  }

  let cookies = new Cookies();
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://64.225.8.160:4000/tenant/tenant"
      );
      setLoader(false);
      setTenantsData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterRentRollsBySearch = () => {
    if (!searchQuery) {
      return tenantsData;
    }

    return tenantsData.filter((tenant) => {
      return (
        `${tenant.tenant_firstName} ${tenant.tenant_lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.property_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.lease_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const editTenantData = async (id, updatedData) => {
    try {
      const editUrl = ` http://64.225.8.160:4000/tenant/tenant/${id}`;
      const response = await axios.put(editUrl, updatedData);

      if (response.status === 200) {
        fetchData();
        setIsEditDialogOpen(false); // Close the dialog
        swal("Success!", "RentRoll updated successfully!", "success"); // Display success message
      } else {
        console.error("Edit request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error editing property:", error);
    }
  };

  const openEditDialog = (tenant) => {
    setEditingTenant({ ...tenant });
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const deleteTenant = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this tenant!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete("http://64.225.8.160:4000/tenant/tenant", {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Tenant deleted successfully!", "success");
              fetchData(); // Refresh your tenant data or perform other actions
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting tenant:", error);
          });
      } else {
        swal("Cancelled", "Tenant is safe :)", "info");
      }
    });
  };

  const editLeasing = (id) => {
    navigate(`/admin/RentRollLeaseing/${id}`);
    console.log(id);
  };
  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Rent Roll</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/RentRollLeaseing")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Lease
            </Button>
          </Col>
        </Row>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {loader ? (
              <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={loader}
                />
              </div>
            ) : (
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col xs="12" sm="6">
                      <FormGroup className="">
                        <Input
                          fullWidth
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            maxWidth: "200px",
                            minWidth: "200px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Lease</th>
                      <th scope="col">Type</th>
                      <th scope="col">Rent</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterRentRollsBySearch()?.map((tenant) => (
                      <tr
                        key={tenant._id}
                        onClick={() => navigateToRentRollDetails(tenant._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{tenant.rental_adress}</td>
                        <td>{tenant.lease_type}</td>
                        <td>{tenant.amount}</td>
                        <td style={{}}>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTenant(tenant._id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                editLeasing(tenant._id);
                              }}
                            >
                              <EditIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ background: "#F0F8FF", marginBottom: "16px" }}>
          Update
        </DialogTitle>
        <DialogContent style={{ width: "100%", maxWidth: "500px" }}>
          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>Lease</InputLabel>
            <TextField
              fullWidth
              value={editingTenant?.property_type || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  property_type: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              Lease
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="propertysub_type"
              value={editingTenant?.rental_adress || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  rental_adress: e.target.value,
                })
              }
            />
          </FormGroup>

          {/* <div style={{ marginBottom: "16px" }}>
            <InputLabel>Type</InputLabel>

            <TextField
              // label="Type"
              fullWidth
              value={editingTenant?.lease_type || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  lease_type: e.target.value,
                })
              }
            />
          </div> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              Type
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name="lease_type "
              value={editingTenant?.lease_type || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  lease_type: e.target.value,
                })
              }
            />
          </FormGroup>
          {/* <InputLabel>Rent</InputLabel>

          <TextField
            // label="Rent"
            fullWidth
            value={editingTenant?.amount || ""}
            onChange={(e) =>
              setEditingTenant({
                ...editingTenant,
                amount: e.target.value,
              })
            }
          /> */}
          <FormGroup>
            <label className="form-control-label" htmlFor="input-property">
              Rent
            </label>
            <Input
              className="form-control-alternative"
              id="input-protype"
              type="text"
              name=" amount"
              value={editingTenant?.amount || ""}
              onChange={(e) =>
                setEditingTenant({
                  ...editingTenant,
                  amount: e.target.value,
                })
              }
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            onClick={() => {
              editTenantData(editingTenant._id, editingTenant);
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RentRoll;
