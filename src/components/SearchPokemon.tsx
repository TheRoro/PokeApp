import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Bidoof404 from "../Assets/404-bidoof.png";

type Props = {

}

type pokemonName = string[];
type pokemonInfo = {

};

const SearchPokemon: React.FC<Props> = () =>{
    const [pkmnName, setpkmnName] = React.useState<pokemonName>(['Luxray', 'luxray']);
    const [pkmnInfo, setpkmnInfo] = React.useState<pokemonInfo>();
    const [pkmnId, setpkmnId] = React.useState<number>(405);
    const [pkmnImg, setpkmnImg] = React.useState(<div>
        <img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/405.png`} alt={'luxray'}/>
    </div>);

    const handleChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let temp = [];
        let formatName = '';
        let value = '';
        value = e.target.value.toString().toLowerCase();
        if(value.length > 0) {
            formatName = value[0].toUpperCase() + value.slice(1, value.length);
        }
        console.log(formatName);
        console.log(value);
        temp.push(formatName);
        temp.push(value);
        setpkmnName(temp);
    }

    const validateName = async (name: string) => {
        if(name === "deoxys") {
            setpkmnName(["Deoxys", "deoxys-normal"]);
            return false;
        }
        return true;
    }

    const searchByName = async () => {
        try {
            setpkmnImg(<div>
                Loading...
            </div>);
            const ans = await validateName(pkmnName[1]);
            var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pkmnName[1] + '/';
            if (!ans) {
                if(pkmnName[0] === "Deoxys")
                    apiUrl = 'https://pokeapi.co/api/v2/pokemon/deoxys-normal/';
            }    
            const resp = await axios.get(apiUrl);
            console.log(resp.data);
            setpkmnInfo(resp.data);
            setpkmnId(resp.data.id);
            setpkmnImg(<div>
                <img className="poke-image" src={`https://pokeres.bastionbot.org/images/pokemon/${resp.data.id}.png`} alt={resp.data.name}/>
            </div>);
        }
        catch(err) {
            alert("Escribe bien o mongol");
            setpkmnImg(<div>
                <img className="poke-image" src={Bidoof404} alt={'404'}/>
            </div>);
            console.error(err);
        }
    }

    return (
        <div className="mt-5">
            <Container>
              <Row className="justify-content-md-center mt-5">
                  <Col md="auto">
                      <h1 className="title2">Search in the Pokedex:</h1>
                  </Col>
              </Row>
              <Row className="justify-content-md-center mt-5">
                  <Col md="auto">
                      <h1 className="title2">{pkmnName[0]}</h1>
                  </Col>
              </Row>
              <Row className="justify-content-md-center mt-5">
                  <Col md="auto">
                    <input value={pkmnName[0]} onChange={handleChangeName}>
                      </input>
                  </Col>
              </Row>
              <Row className="justify-content-md-center mt-5">
                  <Col md="auto">
                      <Button variant="outline-light" size="lg" onClick={searchByName}>Search</Button>
                  </Col>
              </Row>
              <Row className="justify-content-md-center mt-5">
                  <Col md="auto">
                      {pkmnImg}
                  </Col>
              </Row>
        </Container>
        </div>
    );
}

export default SearchPokemon;