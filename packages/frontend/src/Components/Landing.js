import React from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TeamMember from "./TeamMember";

const Header = styled.div`
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px auto;
`;

const NavList = styled.ul`
  display: flex;
  list-style-type: none;
  margin-top: 15px;
`;

const Link = styled.li`
  margin-right: 15px;
  color: #ffffff;
  align-self: center;
`;

const Button = styled.button`
  width: 100px;
  box-shadow: inset 0px 1px 0px 0px #ffffff;
  background: linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%);
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
  display: inline-block;
  cursor: pointer;
  color: #666666;
  font-family: Arial;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 20px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #ffffff;

  :hover {
    background: linear-gradient(to bottom, #f6f6f6 5%, #ffffff 25%);
    background-color: #f6f6f6;
  }
  :active {
    position: relative;
    top: 1px;
  }
`;

const Text = styled.p`
  color: #2f2e41;
  text-align: center;
  margin: 10px;
`;

const Landing = () => {
  const history = useHistory();
  return (
    <div style={{ backgroundColor: "#539FFE" }}>
      <Container style={{ marginTop: "10px" }} maxWidth="lg">
        <Header>
          <img src="logo.png" alt="logo" style={{ width: "64px" }} />
          <NavList>
            <Link>
              <a style={{ color: "#ffffff" }} href="#about">
                About
              </a>
            </Link>
            <Link>
              <a style={{ color: "#ffffff" }} href="#team">
                Team
              </a>
            </Link>
            <Button onClick={() => history.push("/console")}>Console</Button>
          </NavList>
        </Header>
        <section>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              flexFlow: "row wrap",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexFlow: "column wrap",
                flex: "1 0 30%",
              }}
            >
              <h2 style={{ color: "#ffffff" }}>Welcome to DRaycer</h2>
              <p style={{ color: "#ffffff" }}>
                A rendering system that will run on your web browser to render
                your 3D models and produce realistic rendering effects by using
                Ray Tracing, without any hardware that would cost you thousands
                of dollars.
              </p>
            </div>
            <img
              style={{ flex: "0 0 70%", minWidth: "300px" }}
              src="illust.svg"
              alt=""
            />
          </div>
        </section>
        <Paper
          id="about"
          style={{
            marginTop: "30px",
            display: "flex",
            flexFlow: "row wrap",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ textAlign: "center" }}>What is DRaycer?</h3>
            <Text>
              DRaycer is a rendering system that uses client-side programming
              with distributed architecture to run ray tracing algorithm
              anywhere without any required hardware or software from your part.
            </Text>
            <Text>
              You only need to upload your image or create them using DRaycer
              through our state-of-the-art online editor. After this, our ray
              tracing algorithm starts executing on your scene pixel by pixel
              across many computers.
            </Text>
            <Text>
              DRaycer is the senior project of 4 students from CTIS department
              of Bilkent University, Turkey.
            </Text>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Features</h3>
            <Text>
              Online rendering of your system. We provide everything, thats all
              you need.
            </Text>
            <Text>
              Distributed architecture allows us to run our algorithm across
              many devices that we call workers. This allows rapid rendering of
              you scenes.
            </Text>
            <Text>
              Either just upload your scene to the system or use our editor to
              create them. You will have many tools in our editor that will
              assist you.
            </Text>
            <Text>
              Our optional paid packages allows you to have more workers working
              on your scenes with improved algorithm support that enhances the
              quality of the render.
            </Text>
          </div>
        </Paper>
        <Paper
          id="team"
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "25px auto",
            padding: "20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Team</h3>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "space-around",
            }}
          >
            <div>
              <TeamMember
                name="Onur"
                image="/onur.png"
                about="Onur is a game developer responsible for the core ray tracing algorithms of DRaycer."
                contact="https://www.linkedin.com/in/onurozler/"
              />
              <TeamMember
                name="Sinan"
                image="/sinan.png"
                about="Sinan is a full-stack developer responsible for the ray tracing algorithms and the backend of DRaycer."
                contact="https://www.linkedin.com/in/sinansakaoglu/"
              />
            </div>

            <div>
              <TeamMember
                name="Sedat"
                image="/sedat.png"
                about="Sedat is a full-stack JS developer responsible for the front-end of DRaycer."
                contact="https://www.linkedin.com/in/sedatcyalcin/"
              />
              <TeamMember
                name="Mert"
                image="/mert.png"
                about="Mert is a mobile developer responsible for the product development and UI/UX of DRaycer"
                contact="https://www.linkedin.com/in/mert-aydin/"
              />
            </div>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default Landing;
