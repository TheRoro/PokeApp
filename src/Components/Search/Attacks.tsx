import React,{useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navigation from '../Tools/Navigation';
import axios from 'axios';

type Props = {
    pkmnInfo: any,
}

interface levelType {
    name: string,
    lvl: number
}

const Attacks: React.FC<Props> = ({
    pkmnInfo
}) =>{
    const [levelUp, setLevelUp] = React.useState(<div></div>);
    const [tutor, setTutor] = React.useState(<div></div>);
    const [mt, setMt] = React.useState(<div></div>);
    const [movesList, setmovesList] = React.useState<string>();
    
    let list1 = <div></div>;
    let list2 = <div></div>;
    let list3 = <div></div>;

    const fetchMoveDetails = async (url: string) => {
        const resp = await axios.get(url);
        console.log(resp.data.name);
        return resp.data;
    }

    useEffect(() => {

        let levelUp = [];
        let tutor = [];
        let mt = [];
        for(let i = 0; i < pkmnInfo.moves.length; i++){
            let size = pkmnInfo.moves[i].version_group_details.length;
            let name = pkmnInfo.moves[i].move.name;
            let url = pkmnInfo.moves[i].move.url;

            let promise = fetchMoveDetails(url);
            // promise.then(()=> {
            //     console.log(promise);
            // })
            let learn_method = pkmnInfo.moves[i].version_group_details[size - 1].move_learn_method.name;
            
            if(learn_method === "level-up") {
                let lvl = pkmnInfo.moves[i].version_group_details[size - 1].level_learned_at;
                levelUp.push([name, lvl, promise]);
            }
            else if(learn_method === "tutor") {
                tutor.push([name, url, promise]);
            }
            else{
                mt.push([name, url, promise])
            }
        }
        levelUp.sort((a, b) => a[1]-b[1]);

        for(let i = 0; i < levelUp.length; i++) {
            list1 = <div className="full-width">
                {/* <li key={0} className="poke-list"><p>Lv.  Move</p></li> */}
                {levelUp.map((attack) =>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <p className="">{attack[1]}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <p className="">{attack[0]}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}
            </div>
        }
        setLevelUp(list1);
        for(let i = 0; i < tutor.length; i++) {
            list2 = <div className="full-width">
                {tutor.map((attack) =>
                <Row className="justify-content-center">
                <Col xs={6}>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <p className="">{attack[0]}</p>
                        </Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <p className="">{attack[1]}</p>
                </Col>
            </Row>
            )}
            </div>
        }
        setTutor(list2);
        for(let i = 0; i < mt.length; i++) {
            list3 = <div>
                {mt.map((attack) =>
                <Row className="justify-content-start">
                    <Col xs={6}>
                        <p className="">{attack[0]}</p>
                    </Col>
                    <Col xs={6}>
                        <p className="">{attack[1]}</p>
                    </Col>
                </Row>
            )}
            </div>
        }
        setMt(list3);
    },[setLevelUp, setTutor, setMt]);



    return (
        <Container className="evolution">
            <Navigation left="/search/evolution" right=""/>
            <Row className="align-items-center full-height">
                <Col xs={12} className="mb-5">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <h1 className="title2 centered-text">Attacks:</h1>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <p className="texthint centered-text">(Updated to: Ultra-Sun and Ultra-Moon 7th Gen)</p>
                        </Col>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By Leveling up:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {levelUp}
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By TM/TR:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {mt}
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        <h1>By Tutor:</h1>
                    </Row>
                    <Row className="mt-5 align-items-center justify-content-center">
                        {tutor}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Attacks;