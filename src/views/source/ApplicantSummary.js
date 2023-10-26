import Header from 'components/Headers/Header'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Row } from 'reactstrap'

const ApplicantSummary = () => {
    const [selectedDropdownItem, setselectedDropdownItem] = useState("")
    const[isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const id = useParams().id;
    console.log(id, "id");

    const dropdownList =[
        "Draft",
        "Undecided",
        "Approved",
        "Deferred",
        "Canceled",
        "Rejected"
    ]

    const selectedDropdown = (item) => {
        setselectedDropdownItem(item)
        console.log(item, "item");
    }
    
    const handleOpen = () => {
        setIsOpen(true)
    }
  const toggle = () => setIsOpen((prevState) => !prevState);

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
        <div className="formInput d-flex flex-direction-row" style={{ margin: "30px 10px" }}>
          
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
            {
              dropdownList.map((item, index) => {
                return (
                  <DropdownItem key={index} onClick={() => selectedDropdown(item)}>
                    {item}
                  </DropdownItem>
                )
              })
            }
            </DropdownMenu>
          </Dropdown>
          <Button style={ selectedDropdownItem==="Approved" ? {display: "block", marginLeft: "10px"} : {display: "none"}} color='success'>Move in</Button>
        </div>
        </Container>
    </>
  )
}

export default ApplicantSummary