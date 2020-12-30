import React , {useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import moveInfoInit from '../../Assets/moveInfo.json';

import {
    Switch,
    Route,
    useRouteMatch,
    useHistory
} from "react-router-dom";

type Props = {}

type pokemonInfo = {};

const TeamBuilder: React.FC<Props> = () =>{
    let match = useRouteMatch();
    const history = useHistory();
    const [pkNames, setPkNames] = React.useState(['luxray', 'garchomp', 'togekiss', 'roserade', 'empoleon', 'infernape']);
    const [pkImages, setPkImages] = React.useState(
        [<div><img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/405.png`} alt="Luxray"/></div>, 
        <div><img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/445.png`} alt="Garchomp"/></div>,
        <div><img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/468.png`} alt="Togekiss"/></div>, 
        <div><img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/407.png`} alt="Roserade"/></div>, 
        <div><img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/395.png`} alt="Empoleon"/></div>, 
        <div><img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/392.png`} alt="Infernape"/></div>])
    const [loading, setLoading] = React.useState(<div></div>);

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        var key  = e.key || e.keyCode;
        if (key === 'Enter' || key === 13) {
            calculateTeam();
        }
    };

    const calculateTeam = async () => {
        for(let i = 0; i < 6; i++) {
            try {
                setLoading(<div>
                    Loading...
                </div>);
                var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pkNames[i] + '/';
                const resp = await axios.get(apiUrl);
                console.log(resp);
                setLoading(<div></div>);
                // history.push(`${match.url}/info`);
            }
            catch(err) {
                // alert("Move Not Found");
                setLoading(<div>
                    <img className="bidoof-404" src={Bidoof404} alt={'404'}/>
                </div>);
                console.error(err);
            }
        }
    }
    useEffect(() => {
        // searchByName(pk1);
        // searchByName(pk2);
        // searchByName(pk3);
        // searchByName(pk4);
        // searchByName(pk5);
        // searchByName(pk6);
    },);

    return (
        <div className="search">
            <Switch>
            <Route path={`${match.path}/`}>
                <Container className="full-height">
                    <Row className="full-height">
                        <Col xs={12}>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <h1 className="title2 centered-text">TeamBuilder</h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <p className="texthint centered-text">(Eg: Tackle, Thunder Shock)</p>
                                </Col>
                            </Row>
                            <Row className="justify-content-center align-self-center mt-5">
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <input className="search-teambuilder" value={pkNames[0]} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <input className="search-teambuilder" value={pkNames[1]} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <input className="search-teambuilder" value={pkNames[2]} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <input className="search-teambuilder" value={pkNames[3]} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <input className="search-teambuilder" value={pkNames[4]} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <input className="search-teambuilder" value={pkNames[5]} onKeyPress={handleKeypress}>
                                    </input>
                                </Col>
                            </Row>
                            <Row className="justify-content-center align-self-center mt-5">
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <h1 className="text4 centered-text">{pkNames[0]}</h1>
                                    {pkImages[0]}
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <h1 className="text4 centered-text">{pkNames[1]}</h1>
                                    {pkImages[1]}
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <h1 className="text4 centered-text">{pkNames[2]}</h1>
                                    {pkImages[2]}
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <h1 className="text4 centered-text">{pkNames[3]}</h1>
                                    {pkImages[3]}
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <h1 className="text4 centered-text">{pkNames[4]}</h1>
                                    {pkImages[4]}
                                </Col>
                                <Col xs={6} sm={4} md={3} lg={2} className="search-text">
                                    <h1 className="text4 centered-text">{pkNames[5]}</h1>
                                    {pkImages[5]}
                                </Col>
                            </Row>
                            <Row className="justify-content-center align-self-end mt-5">
                                <Col xs="auto">
                                    <Button variant="outline-light" size="lg" onClick={calculateTeam}>Calculate</Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-5">
                                <Col xs="auto">
                                    {loading}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Route>
            </Switch>
        </div>
    );
}

export default TeamBuilder;