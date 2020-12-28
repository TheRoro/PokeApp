import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Props = {}

const NoTypesAlert: React.FC<Props> = ({}) =>{

    return (
        <div>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <h1 className="centered-text text3">Select at least one type!!!</h1>
                </Col>
            </Row>
        </div>
    );
}

export default NoTypesAlert;