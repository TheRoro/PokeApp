import React , {useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pokeffective from './Images/Pokeffective.jpg'
import PokeffectiveRetro from './Images/Pokeffective-Retro.jpg'

import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";

const OlderVersions: React.FC<{}> = () => {
    let match = useRouteMatch();

    useEffect(() => {

    },);

    return (
        <div className="teambuilder">
            <Switch>
            <Route path={`${match.path}/`}>
                <div className="full-height container-fluid">
                    <Row className="align-items-center full-height">
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <h1 className="title2 centered-text">Older Versions</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <p className="texthint centered-text">For all the nostalgics</p>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs={12} sm={12} md={6} className="mt-2 mb-3 mb-md-0">
                                    <Row className="justify-content-center">
                                        <Col xs="auto">
                                            {/* <h1 className="title5 centered-text">Retro</h1> */}
                                            <a className="link-old" href="https://8rb.github.io/Pokeffective-Old/" target="_blank" rel="noreferrer">
                                                <img className="older-image" src={PokeffectiveRetro} alt={'Pokeffective-Retro'}/>
                                            </a>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={6} className="mt-5 mt-md-2">
                                    <Row className="justify-content-center">
                                        <Col xs="auto">
                                            {/* <h1 className="title5 centered-text">Pokeffective</h1> */}
                                            <a className="link-old" href="https://pokeffective.onrender.com/" target="_blank" rel="noreferrer">
                                                <img className="older-image" src={Pokeffective} alt={'Pokeffective'}/>
                                            </a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Route>
            </Switch>
        </div>
    );
}

export default OlderVersions;