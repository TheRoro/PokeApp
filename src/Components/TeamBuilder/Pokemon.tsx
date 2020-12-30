import React , {useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import moveInfoInit from '../../Assets/moveInfo.json';

type Props = {}

const Pokemon: React.FC<Props> = ({}) =>{
    const [pkmnName, setpkmnName] = React.useState<string>('luxray');
    const [pkmnImg, setpkmnImg] = React.useState(<img className="poke-builder" src={`https://pokeres.bastionbot.org/images/pokemon/405.png`} alt={'luxray'}/>);
    
    const handleChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let formatName = '';
        let value = '';
        value = e.target.value.toString().toLowerCase();
        if(value.length > 0) {
            formatName = value[0].toUpperCase() + value.slice(1, value.length);
        }
        setpkmnName(value);
    }

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        var key  = e.key || e.keyCode;
        if (key === 'Enter' || key === 13) {
            // searchByName();
        }
    };

    return (
        <Col xs={6} sm={4} md={3} lg={2} className="search-text">
            <input className="search-teambuilder" value={pkmnName} onChange={handleChangeName} onKeyPress={handleKeypress}>
            </input>
            <div className="builder-textdiv">
                <h1 className="builder-text centered-text">{pkmnName}</h1>
            </div>
            {pkmnImg}
        </Col>
    );
}

export default Pokemon;