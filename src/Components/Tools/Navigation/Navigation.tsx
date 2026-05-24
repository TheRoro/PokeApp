import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {NavButton} from './Styles';

type Props = {
    left: string,
    right: string,
    leftLabel?: string,
    rightLabel?: string,
}

const Navigation: React.FC<Props> = ({
    left,
    right,
    leftLabel = 'Previous page',
    rightLabel = 'Next page',
}) => {
    return(
    <div>
    {right !== "" ? 
        <Row className="">
            <Col xs={6}>
                <Row className="justify-content-start">
                    <Col xs="auto">
                        <NavButton to={left} aria-label={leftLabel}>
                            <i className="fas fa-angle-left fa-2x" aria-hidden="true"></i>
                        </NavButton>
                    </Col>
                </Row>
            </Col>
            <Col xs={6}>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <NavButton to={right} aria-label={rightLabel}>
                            <i className="fas fa-angle-right fa-2x" aria-hidden="true"></i>
                        </NavButton>
                    </Col>
                </Row>
            </Col>
        </Row>
    : 
        <Row className="">
            <Col xs={6}>
                <Row className="justify-content-start">
                    <Col xs="auto">
                        <NavButton to={left} aria-label={leftLabel}>
                            <i className="fas fa-angle-left fa-2x" aria-hidden="true"></i>
                        </NavButton>
                    </Col>
                </Row>
            </Col>
        </Row>
    }
    </div>
    )
}

export default Navigation;