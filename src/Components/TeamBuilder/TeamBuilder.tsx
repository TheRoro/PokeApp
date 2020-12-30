import React , {useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Pokemon from './Pokemon';

import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";

type Props = {}

const TeamBuilder: React.FC<Props> = () => {
    let match = useRouteMatch();

    const calculateTeam = async () => {
        alert("Muchas gracias por calcular amigo :)");
    }
    useEffect(() => {

    },);

    return (
        <div className="teambuilder">
            <Switch>
            <Route path={`${match.path}/`}>
                <Container className="full-height">
                    <Row className="full-height">
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <h1 className="title2 centered-text">TeamBuilder</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <p className="texthint centered-text">(Select your team)</p>
                                </Col>
                            </Row>
                            <Row>
                                <Pokemon/>
                                <Pokemon/>
                                <Pokemon/>
                                <Pokemon/>
                                <Pokemon/>
                                <Pokemon/>
                            </Row>
                            <Row className="justify-content-center align-self-end mt-5">
                                <Col xs="auto">
                                    <Button variant="outline-light" size="lg" onClick={calculateTeam}>Calculate</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Route>
            </Switch>
        </div>
    );
}

export default TeamBuilder;