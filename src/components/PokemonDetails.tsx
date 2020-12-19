import React, { useEffect }  from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StatBar from './PokemonStats';

import {
    Link
} from "react-router-dom";

type pokemonName = string[];

type Props = {
    pkmnName: pokemonName,
    pkmnInfo: any,
    pkmnId: number,
    pkmnImg: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
}

const PokemonDetails: React.FC<Props> = ({
    pkmnName,
    pkmnInfo,
    pkmnId,
    pkmnImg,
}) =>{
    const [type1, setType1] = React.useState<string>('Electric');
    const [type2, setType2] = React.useState<string>('');

    const capitalize = ((s: string) => {
        let temp = s[0].toUpperCase() + s.slice(1);
        return temp
    })

    useEffect(() => {
        if(type1 !== capitalize(pkmnInfo.types[0].type.name)){
            setType1(capitalize(pkmnInfo.types[0].type.name));
        }
        if(pkmnInfo.types.length > 1) {
            setType2(capitalize(pkmnInfo.types[1].type.name));
        }
    },);

    return(
        <div>
            <Container>
              <Row className="justify-content-center">
                  <Col xs="auto">
                      <h1 className="title2">{pkmnName[0]}</h1>
                  </Col>
              </Row>
              <Row className="justify-content-center mt-4">
                  <Col xs="auto" sm={12} md={6}>
                    <Row className="justify-content-center">
                        <Col xs="auto"><h1 className={`title4 ${type1}`}>Type 1: {type1}</h1></Col>
                    </Row>
                    {type2 !== '' &&
                    <Row className="justify-content-center">
                        <Col xs="auto"><h1 className={`title4 ${type2}`}>Type 2: {type2}</h1></Col>
                    </Row>}
                    <Row className="mt-4">
                        <StatBar name={"HP"} value={parseInt(JSON.stringify(pkmnInfo.stats[0].base_stat))}/>
                    </Row>
                    <Row className="mt-3">
                        <StatBar name={"Attack"} value={parseInt(JSON.stringify(pkmnInfo.stats[1].base_stat))}/>
                    </Row>
                    <Row className="mt-3">
                        <StatBar name={"Defense"} value={parseInt(JSON.stringify(pkmnInfo.stats[2].base_stat))}/>
                    </Row>
                    <Row className="mt-3">
                        <StatBar name={"Sp. Attack"} value={parseInt(JSON.stringify(pkmnInfo.stats[3].base_stat))}/>
                    </Row>
                    <Row className="mt-3">
                        <StatBar name={"Sp. Defense"} value={parseInt(JSON.stringify(pkmnInfo.stats[4].base_stat))}/>
                    </Row>
                    <Row className="mt-3">
                        <StatBar name={"Speed"}  value={parseInt(JSON.stringify(pkmnInfo.stats[5].base_stat))}/>
                    </Row>
                  </Col>
                  <Col xs="auto" sm={12} md={6}>
                    <Row className="justify-content-md-center my-auto">
                        <Col md="auto">
                            {pkmnImg}
                        </Col>
                    </Row>
                  </Col>
              </Row>
              <Row className="justify-content-center mt-4">
                  <Col xs="auto">
                    <Link to="/search/details2" className="text-light">
                        <i className="fas fa-angle-down fa-2x"></i>
                    </Link>
                  </Col>
              </Row>
            </Container>
        </div>
    );

}

export default PokemonDetails;