import React, { useEffect } from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

const Header = styled.div`
    height: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

const NavList = styled.ul`
    display: flex;
    list-style-type: none;
    margin-top: 15px;
`;

const Link = styled.li`
    margin-right: 35px;
    color: #ffffff;
    align-self: center;
`;

const Button = styled.button`
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
        background: linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
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
    useEffect(() => {}, []);

    const history = useHistory();
    return (
        <div style={{ backgroundColor: "#539FFE" }}>
            <Header>
                <img src="logo.png" alt="logo" style={{ width: "48px" }} />
                <NavList>
                    <Link>Home</Link>
                    <Link>About</Link>
                    <Link>Team</Link>
                    <Link>
                        <Button onClick={() => history.push("/console")}>
                            Console
                        </Button>
                    </Link>
                </NavList>
            </Header>
            <Container style={{ marginTop: "10px" }} maxWidth="lg">
                <section>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-evenly",
                            flexFlow: "row wrap",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexFlow: "column wrap",
                                flex: "1 0 40%",
                            }}
                        >
                            <h2 style={{ color: "#ffffff" }}>
                                Welcome to DRaycer
                            </h2>
                            <p style={{ color: "#ffffff" }}>
                                A rendering system that will run on your web
                                browser to render your 3D models and produce
                                realistic rendering effects by using Ray
                                Tracing, without any hardware that would cost
                                you thousands of dollars.
                            </p>
                        </div>
                        <img
                            style={{ flex: "1 0 60%" }}
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
                        flexDirection: "row wrap",
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <h3 style={{ textAlign: "center" }}>
                            What is DRaycer?
                        </h3>
                        <Text>
                            DRaycer is a rendering system that uses client-side
                            programming with distributed architecture to run ray
                            tracing algorithm anywhere without any required
                            hardware or software from your part.
                        </Text>
                        <Text>
                            You only need to upload your image or create them
                            using DRaycer through our state-of-the-art online
                            editor. After this, our ray tracing algorithm starts
                            executing on your scene pixel by pixel across many
                            computers.
                        </Text>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <h3 style={{ textAlign: "center" }}>Features</h3>
                        <Text>
                            Online rendering of your system. We provide
                            everything, thats all you need.
                        </Text>
                        <Text>
                            Distributed architecture allows us to run our
                            algorithm across many devices that we call workers.
                            This allows rapid rendering of you scenes.
                        </Text>
                        <Text>
                            Either just upload your scene to the system or use
                            our editor to create them. You will have many tools
                            in our editor that will assist you.
                        </Text>
                        <Text>
                            Our optional paid packages allows you to have more
                            workers working on your scenes with improved
                            algorithm support that enhances the quality of the
                            render.
                        </Text>
                    </div>
                    <div></div>
                </Paper>
            </Container>
        </div>
    );
};

export default Landing;
