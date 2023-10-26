import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Navbar,
  Nav,
  Container,
  Media,
  FormGroup,  
  Row,
  Col
} from "reactstrap";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { makeStyles } from '@mui/styles';


const TenantNavbar = (props) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  let cookies = new Cookies();
  let Logout = () => {
    cookies.remove("token");
    cookies.remove("Tenant ID");
  };
  const { id } = useParams();
  console.log(id);
  const [vendorDetails, setVendorDetails] = useState({});
  const [rental_adress, setRentalAddress] = useState("");
  console.log(rental_adress)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let navigate = useNavigate();

  let cookie_id = cookies.get("Tenant ID");
  console.log(cookie_id)
  
  const getVendorDetails = async () => {
    try {
      const response = await axios.get(
        `http://64.225.8.160:4000/tenant/tenant_summary/${cookie_id}`
      );
      console.log(response.data.data)
      setVendorDetails(response.data.data);
      setRentalAddress(response.data.data.rental_adress)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      setError(error);
      setLoading(false);
    }
  };

// const {vendor_name}= useParams();
// const ENDPOINT = 'http://64.225.8.160:4001/notification/vendornotification/:vendor_name';
const [notification, setNotification] = useState('');
const [notificationCount, setNotificationCount] = useState(0);
const [notificationData, setNotificationData] = useState([]);
console.log("Rental Address", rental_adress);
const notifyData = [];

const [selectedProp, setSelectedProp] = useState("Select");

const handlePropertySelect = (property) => {
  setSelectedProp(property);
};

useEffect(() => {
  fetch(`http://64.225.8.160:4000/notification/tenantnotification/${rental_adress}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        setNotificationData(data.data);
        setNotificationCount(data.data.length); 
        console.log("Notification",data.data);
        console.log("Rental Address",rental_adress)
      } else {
        // Handle error
        console.error("Error:", data.message);
      }
    })
    .catch((error) => {
      // Handle network error
      console.error("Network error:", error);
    });
}, [rental_adress]);

useEffect(() => {
  getVendorDetails();
  console.log(id);
}, [id]);

const navigateToDetails = (workorder_id) => {
  // Make a DELETE request to delete the notification
  axios.delete(`http://64.225.8.160:4000/notification/notification/${workorder_id}`)
    .then((response) => {
      if (response.status === 200) {
        // Notification deleted successfully, now update the state to remove it from the list
        const updatedNotificationData = notificationData.filter((notification) => notification.workorder_id !== workorder_id);
        setNotificationData(updatedNotificationData);
        setNotificationCount(updatedNotificationData.length);
        console.log(`Notification with workorder_id ${workorder_id} deleted successfully.`);
      } else {
        console.error(`Failed to delete notification with workorder_id ${workorder_id}.`);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Continue with navigating to the details page
  navigate(`/tenant/tworkorderdetail/${workorder_id}`);
};

// const navigateToDetails = (workorder_id) => {
//   // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
//   navigate(`/tenant/tworkorderdetail/${workorder_id}`);
//   console.log(workorder_id);
// };


  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/tenant/tenantdashboard"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0" onClick={toggleSidebar} style={{ cursor: 'pointer',position: 'relative' }}>
              <NotificationsIcon style={{color:'white',fontSize:'30px'}}/>
              {notificationCount > 0 && (
              <div className="notification-circle" style={{position: 'absolute',top: '-15px',right: '-20px',background: 'red',borderRadius: '50%',padding: '0.1px 8px'}}>
                <span className="notification-count" style={{color:'white',fontSize:"13px"}}>{notificationCount}</span>
              </div>
               )}
            </FormGroup>
          </Form>
          
          <Nav className="align-items-center d-none d-md-flex" navbar>
            
            <Drawer anchor="right" open={isSidebarOpen} onClose={toggleSidebar}>
              <div
                role="presentation"
                onClick={toggleSidebar}
                onKeyDown={toggleSidebar}
              >
                <List style={{ width: '350px' }}>
                  <h2 style={{color:'blue',marginLeft:'15px'}}>
                    Notifications
                  </h2>
                  <Divider />
                  {notificationData.map((data) => {
                    const notificationTitle =
                      data.notification_title || 'No Title Available';
                    const notificationDetails =
                      data.notification_details || 'No Details Available';
                    const notificationTime = new Date(data.notification_time).toLocaleString(); 

                    return (
                      <div key={data._id}>
                      <ListItem
                       
                        onClick={() => handlePropertySelect(data)}
                      >
                        <div>
                          <h4>{notificationTitle}</h4>
                          <p>{notificationDetails}</p>
                          <Row>
                            <Col lg="8">
                               <p>{notificationTime}</p>
                            </Col>
                            <Col>
                              <Button
                              variant="contained"
                              color="primary"
                              style={{textTransform: 'none', fontSize: '12px' }}
                              onClick={() => navigateToDetails(data.workorder_id)}
                            >
                              View
                            </Button>
                            </Col>
                          </Row>
                       </div>
                       
                        {/* <ListItemText
                          primary={notificationTitle}
                          secondary={notificationTime}
                        />
                        <ListItemText
                          primary={notificationDetails}
                          secondary="Notification Details"
                        /> */}
                      </ListItem>
                      <Divider/>
                     </div> 
                    );
                  })}
                  
                </List>
                <Divider />
                {/* Other sidebar content goes here */}
              </div>
            </Drawer>

          </Nav>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/profile-cover.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                    {vendorDetails.tenant_firstName} { vendorDetails.tenant_lastName }
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome</h6>
                </DropdownItem>
                {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span> 
                </DropdownItem>*/}
                <DropdownItem divider />
                <DropdownItem href="#rms" to="/auth/login"  onClick={() => {
              Logout();
            }} tag={Link} >
                  
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default TenantNavbar;
