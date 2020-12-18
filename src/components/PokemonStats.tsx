import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Props = {
    value: number,
    name: string
}

const StatBar: React.FC<Props> = ({
    value,
    name
}) => {
    const [barColor, setBarColor] = React.useState("Green");
    const [percentage, setPercentage] = React.useState(value);

    useEffect(() => {

        if(value > 150) {
            setPercentage(100);
        }
        else{
            setPercentage(value*100/150);
        }

        if(value >= 0 && value < 40){
            setBarColor("BarRed");
        }
        else if(value >= 40 && value < 60){
            setBarColor("BarDarkOrange");
        }
        else if(value >= 60 && value < 80){
            setBarColor("BarOrange");
        }
        else if(value >= 80 && value < 100){
            setBarColor("BarYellow");
        }
        else if(value >= 100 && value < 150){
            setBarColor("BarGreen");
        }
        else{
            setBarColor("BarBlue");
        }
      }, [setBarColor, setPercentage]);

    return(
        <Container>
            <Row>
                <Col>
                    {name +': ' + value}
                </Col>
                <Col xs={8}>
                    <div className={`statBar ${barColor}`} style={ { width: `${percentage}%` } }>
                    </div>
                </Col> 
            </Row>
        </Container>
    );
}
export default StatBar;