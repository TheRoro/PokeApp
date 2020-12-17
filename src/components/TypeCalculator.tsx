import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AllTypes from '../Assets/allTypes';
import Calculator from './Calculator';
type Props = {

}

type typeName = string;

const TypeCal: React.FC<Props> = () =>{
    const [type1, setType1] = React.useState<typeName>('Fire');
    const [type2, setType2] = React.useState<typeName>('Fighting');

    const handleChangeType1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType1(newType.toString());
    }

    const handleChangeType2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType2(newType.toString());
    }

    const calculateTypes = () => {
        alert("Calculando...");
    }

    return (
      <div className="type">
          <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h1 className="title2">Type Calculator</h1>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <p className="text2">Select the Types: </p>
                    </Col>
                    <Col>
                        <select value={type1} onChange={handleChangeType1}>
                            {AllTypes.map((option, index) => (
                                <option value={option.value} key={index}>{option.label}</option>
                            ))}
                        </select>
                    </Col>
                    <Col>
                        <select value={type2} onChange={handleChangeType2}>
                            {AllTypes.map((option, index) => (
                                <option value={option.value} key={index}>{option.label}</option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col md={{ span: 8, offset: 2 }}>
                        <h1 className={`title3 ${type1}`}>Type 1: {type1}</h1>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col md={{ span: 8, offset: 2 }}>
                        <h1 className={`title3 ${type2}`}>Type 2: {type2}</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-5">
                    <Col md="auto">
                        <p className="calculateBtn" onClick={calculateTypes}>Calculate</p>
                    </Col>
                </Row>
                <Row>
                    <Calculator type1={type1} type2={type2}/>
                </Row>
          </Container>
      </div>
    );
}

export default TypeCal;