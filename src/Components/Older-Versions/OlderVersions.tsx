import React from 'react';
import Pokeffective from './Images/Pokeffective.jpg'
import PokeffectiveRetro from './Images/Pokeffective-Retro.jpg'
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    Title,
    Text,
    OlderContainer,
    Link,
    Row,
    Col,
    Image
  } from './OlderVersionsStyles';


import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";

const OlderVersions: React.FC<{}> = () => {
    let match = useRouteMatch();

    return (
        <OlderContainer>
            <Switch>
            <Route path={`${match.path}/`}>
                <div className="full-height container-fluid">
                    <Row className="align-items-center">
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <Title>Older Versions</Title>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <Text>For all the nostalgics</Text>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs={12} sm={12} md={6} className="mt-2 mb-3 mb-md-0">
                                    <Row className="justify-content-center">
                                        <Col xs="auto">
                                            <Link href="https://8rb.github.io/Pokeffective-Old/" target="_blank" rel="noreferrer">
                                                <Image effect="blur" src={PokeffectiveRetro} alt={'Pokeffective-Retro'}/>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={6} className="mt-5 mt-md-2">
                                    <Row className="justify-content-center">
                                        <Col xs="auto">
                                            <Link href="https://pokeffective.onrender.com/" target="_blank" rel="noreferrer">
                                                <Image effect="blur" src={Pokeffective} alt={'Pokeffective'}/>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Route>
            </Switch>
        </OlderContainer>
    );
}

export default OlderVersions;