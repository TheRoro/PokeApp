import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AllTypes from '../Assets/allTypes';

type Props = {
    type1: string,
    type2: string,
    setType1: any,
    setType2: any,
}

const TypeSelector: React.FC<Props> = ({type1, type2, setType1, setType2}) =>{
    const handleChangeType1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType1(newType.toString());
    }

    const handleChangeType2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType2(newType.toString());
    }
    return(
        <div className="type">
        <Container>
              <Row className="justify-content-center">
                  <Col md="auto">
                      <h1 className="title2 centered-text">Type Calculator</h1>
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
        </Container>
    </div>
    );
}

export default TypeSelector;
