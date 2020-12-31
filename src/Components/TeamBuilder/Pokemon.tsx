import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';

type Props = {}

const Pokemon: React.FC<Props> = () => {
    const [pkmnName, setpkmnName] = React.useState<string>('luxray');
    const [pkmnImg, setpkmnImg] = React.useState(<img className="poke-builder" src={`https://pokeres.bastionbot.org/images/pokemon/405.png`} alt={'luxray'}/>);
    const [types, setTypes] = React.useState<string[]>(['electric', '']);
    const searchPkmn = async (name: string) => {
        try {
            setpkmnImg(<div>
                Loading...
            </div>);
            setTypes(['', '']);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name + '/';
            const resp = await axios.get(apiUrl);
            setpkmnImg(<img className="poke-builder" src={`${resp.data.sprites.other['official-artwork'].front_default}`} alt={resp.data.name}/>);
            
            let temp = [];
            for(let i = 0; i < 2; i++) {
                if(resp.data.types[i] !== undefined){
                    temp.push(resp.data.types[i].type.name);
                }
                else{
                    temp.push('');
                }
            }
            setTypes(temp);
        }
        catch(err) {
            setpkmnImg(<div>
                <img className="poke-builder" src={Bidoof404} alt={'404'}/>
            </div>);
            console.error(err);
        }
    }

    const handleChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = '';
        value = e.target.value.toString().toLowerCase();
        setpkmnName(value);
    }

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        var key  = e.key || e.keyCode;
        if (key === 'Enter' || key === 13 || key === 'Tab' || key === 9) {
            searchPkmn(pkmnName);
        }
    };

    const handleOut = () => {
        searchPkmn(pkmnName);
    };

    return (
        <Col xs={6} sm={4} md={4} lg={2} className="search-text">
            <Row className="justify-content-center">
                <Col xs="auto">
                    <input className="search-teambuilder" value={pkmnName} onChange={handleChangeName} onKeyPress={handleKeypress} onBlur={handleOut}>
                    </input>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12}>
                    <div className="builder-textdiv">
                        <h1 className="builder-text centered-text">{pkmnName}</h1>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12}>
                    {pkmnImg}
                </Col>
            </Row>
            {types[0][0] !== undefined && 
            <Row className="justify-content-center">
                <Col xs="auto">
                    <p className={`${types[0][0].toUpperCase() + types[0].slice(1)} typetext`}>{types[0]}</p>
                </Col>
            </Row>}
            {types[1][0] !== undefined && 
            <Row className="justify-content-center">
                <Col xs="auto">
                    <p className={`${types[1][0].toUpperCase() + types[1].slice(1)} typetext`}>{types[1]}</p>
                </Col>
            </Row>}
        </Col>
    );
}

export default Pokemon;