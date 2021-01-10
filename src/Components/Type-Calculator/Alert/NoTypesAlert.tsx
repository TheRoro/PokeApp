import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Title} from './Styles';

type Props = {}

const NoTypesAlert: React.FC<Props> = () =>{

    return (
        <div>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Title>Select at least one type!!!</Title>
                </Col>
            </Row>
        </div>
    );
}

export default NoTypesAlert;