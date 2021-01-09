import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
    Link
} from "react-router-dom";

type Props = {
    left: string,
    right: string
}

const Navigation: React.FC<Props> = ({
    left,
    right
}) => {
    return(
    <div>
    {right !== "" ? 
        <Row className="">
            <Col xs={6}>
                <Row className="justify-content-start">
                    <Col xs="auto">
                        <Link to={left}>
                            <i className="fas fa-angle-left fa-2x"></i>
                        </Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={6}>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <Link to={right}>
                            <i className="fas fa-angle-right fa-2x"></i>
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    : 
        <Row className="">
            <Col xs={6}>
                <Row className="justify-content-start">
                    <Col xs="auto">
                        <Link to={left}>
                            <i className="fas fa-angle-left fa-2x"></i>
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    }
    </div>
    )
}

export default Navigation;