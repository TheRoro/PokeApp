import React , {useEffect} from 'react';
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
    
    const searchPkmn = async (name: string) => {
        try {
            setpkmnImg(<div>
                Loading...
            </div>);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name + '/';
            const resp = await axios.get(apiUrl);
            setpkmnImg(<img className="poke-builder" src={`https://pokeres.bastionbot.org/images/pokemon/${resp.data.id}.png`} alt={resp.data.name}/>);
        }
        catch(err) {
            setpkmnImg(<div>
                <img className="poke-builder" src={Bidoof404} alt={'404'}/>
            </div>);
            // console.error(err);
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
        <Col xs={6} sm={4} md={3} lg={2} className="search-text">
            <input className="search-teambuilder" value={pkmnName} onChange={handleChangeName} onKeyPress={handleKeypress} onBlur={handleOut}>
            </input>
            <div className="builder-textdiv">
                <h1 className="builder-text centered-text">{pkmnName}</h1>
            </div>
            {pkmnImg}
        </Col>
    );
}

export default Pokemon;