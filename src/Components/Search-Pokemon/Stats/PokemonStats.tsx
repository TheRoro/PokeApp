import React, { useEffect }  from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StatBar from '../../Tools/StatBar/StatBar';
import Navigation from '../../Tools/Navigation/Navigation';
import DefensiveCoverage from '../Coverage/DefensiveCoverage';
import OffensiveCoverage from '../Coverage/OffensiveCoverage';
import PokeBall from '../../../Assets/pokeapp.png';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { toPokemonApiSlug } from '../../Tools/pokemonNames';
import ApiError from '../../Tools/ApiError/ApiError';
import { describeApiError } from '../../Tools/ApiError/apiErrors';
import { getTypeColor } from '../../Tools/TypeBadge';
import typeIcons from '../../../Assets/type-icons';
import { FaPlay } from 'react-icons/fa';
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
    ArtworkColumn,
    ArtworkBody,
    ArtworkStack,
    ColumnFooter,
    CryButton,
    CryControls,
    CryMessage,
    HiddenAudio,
    Loading,
    LoadingCol,
    LoadingImg,
    LazyImage,
    PokemonTypeCard,
    PokemonTypeIcon,
    PokemonTypeName,
    PokemonTypeRole,
    PokemonTypes,
    PokemonTypeText,
    PokemonHeader,
    PokemonIdentity,
    PokemonName,
    PokemonNumber,
    StatTotal,
    StatsBody,
    StatsColumn,
    StatsContainer,
} from './StatsStyles';

type infoType = {
    stats: any[],
    types: any[],
    cries?: {
        latest?: string | null,
        legacy?: string | null,
    }
};

const loadingIndicator = <Loading role="status" aria-label="Loading Pokémon">
    <Row className="justify-content-center mt-5">
        <LoadingCol xs="auto">
            <LoadingImg src={PokeBall} alt=""></LoadingImg>
        </LoadingCol>
    </Row>
</Loading>;

const PokemonStats: React.FC = () =>{
    const [type1, setType1] = React.useState<string>('Electric');
    const [type2, setType2] = React.useState<string>('None');
    const [img, setImg] = React.useState(
        <Loading>
            <Row className="justify-content-center mt-5">
                <LoadingCol xs="auto">
                    <LoadingImg src={PokeBall} alt="pokeball"></LoadingImg>
                </LoadingCol>
            </Row>
        </Loading>);
    const [info, setInfo] = React.useState<infoType>();
    const [loading, setLoading] = React.useState(loadingIndicator);
    const [id, setId] = React.useState<string>();
    const { name = '' } = useParams<'name'>();
    const [prettyName, setPrettyName] = React.useState(name);
    const [retry, setRetry] = React.useState(0);
    const [cryUrl, setCryUrl] = React.useState('');
    const [cryError, setCryError] = React.useState('');
    const [isCryPlaying, setIsCryPlaying] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const autoPlayedCryRef = React.useRef('');

    const pretty = (value: string) => {
        let temp = "";
        for(let i = 0; i < value.length; i++) {
            if(i === 0){
                temp+=value[0].toUpperCase();
            }
            else if(value[i] === "-"){
                temp+=" ";
            }
            else if(i !== 0 && value[i - 1] === "-"){
                temp+=value[i].toUpperCase();
            }
            else {
                temp+=value[i];
            }
        }
        return temp;
    }

    const capitalize = ((s: string) => {
        let temp = s[0].toUpperCase() + s.slice(1);
        return temp
    })

    useEffect(() => {
        const controller = new AbortController();
        setInfo(undefined);
        setType2('None');
        setCryUrl('');
        setCryError('');
        setIsCryPlaying(false);
        autoPlayedCryRef.current = '';
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setLoading(loadingIndicator);

        const search = async () => {
            try {
                const apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + toPokemonApiSlug(name) + '/';
                const resp = await axios.get(apiUrl, { signal: controller.signal });
                setInfo(resp.data);
                setId(resp.data.species.url.substring(42, resp.data.species.url.length - 1));
                setCryUrl(
                    resp.data.cries?.latest
                    ?? resp.data.cries?.legacy
                    ?? '',
                );

                // 1/100 chance of shiny!
                const shinyRoll = Math.floor(Math.random() * 100) === 0;
                const shinyUrl = resp.data.sprites.other['official-artwork'].front_shiny;
                const defaultUrl = resp.data.sprites.other['official-artwork'].front_default;
                const gotShiny = shinyRoll && !!shinyUrl;

                setImg(<div style={{ position: 'relative', display: 'inline-block' }}><LazyImage effect="blur" src={gotShiny ? shinyUrl : defaultUrl} alt={resp.data.name}/>{gotShiny && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '999px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
                        animation: 'shinyPulse 1.5s ease-in-out infinite',
                        zIndex: 10,
                    }}>
                        ✨ Shiny!
                    </div>
                )}</div>);
                setType1(capitalize(resp.data.types[0].type.name));
                setType2(
                    resp.data.types.length > 1
                        ? capitalize(resp.data.types[1].type.name)
                        : 'None',
                );
                setPrettyName(pretty(resp.data.name));
            }
            catch(err) {
                if (axios.isCancel(err)) return;
                setLoading(
                    <ApiError
                        error={describeApiError(err, 'Pokémon')}
                        onRetry={() => setRetry(value => value + 1)}
                    />,
                );
            }
        }

        void search();
        return () => controller.abort();
    }, [name, retry]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !cryUrl || autoPlayedCryRef.current === cryUrl) return;

        autoPlayedCryRef.current = cryUrl;
        audio.currentTime = 0;
        void audio.play().catch(error => {
            if (error instanceof DOMException && error.name === 'NotAllowedError') {
                return;
            }
            setCryError('This Pokémon cry could not be played.');
        });

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [cryUrl]);

    const playCry = () => {
        const audio = audioRef.current;
        if (!audio) return;

        setCryError('');
        audio.currentTime = 0;
        void audio.play().catch(() => {
            setCryError('This Pokémon cry could not be played.');
        });
    };

    const totalStats = info?.stats.reduce(
        (sum: number, stat: any) => sum + stat.base_stat,
        0,
    ) ?? 0;
    return(
        <>{info ?
        <StatsContainer>
            <div style={{ paddingTop: '1rem' }}>
                <Navigation
                    left="/search"
                    right={`/search/${name}/evolution`}
                    leftLabel="Back to Pokémon search"
                    rightLabel="View evolutions"
                />
            </div>
            <PokemonHeader>
                <PokemonIdentity>
                    <PokemonName>{prettyName}</PokemonName>
                    <PokemonNumber>#{id}</PokemonNumber>
                </PokemonIdentity>
            </PokemonHeader>
            <Row className="align-items-center">
                <Col xs={12}>
                    <Row className="justify-content-center align-items-stretch mt-2">
                        <StatsColumn xs={12} sm={12} md={6}>
                            <StatsBody>
                                <PokemonTypes aria-label={`${prettyName} types`}>
                                    <PokemonTypeCard $color={getTypeColor(type1)}>
                                        <PokemonTypeIcon src={typeIcons[type1]} alt="" />
                                        <PokemonTypeText>
                                            <PokemonTypeRole>Primary type</PokemonTypeRole>
                                            <PokemonTypeName>{type1}</PokemonTypeName>
                                        </PokemonTypeText>
                                    </PokemonTypeCard>
                                    {type2 !== 'None' && type2 !== '' &&
                                    <PokemonTypeCard $color={getTypeColor(type2)}>
                                        <PokemonTypeIcon src={typeIcons[type2]} alt="" />
                                        <PokemonTypeText>
                                            <PokemonTypeRole>Secondary type</PokemonTypeRole>
                                            <PokemonTypeName>{type2}</PokemonTypeName>
                                        </PokemonTypeText>
                                    </PokemonTypeCard>}
                                </PokemonTypes>
                                <Row className="justify-content-center">
                                    <StatBar name={"HP"} value={parseInt(JSON.stringify(info.stats[0].base_stat!))}/>
                                </Row>
                                <Row className="justify-content-center mt-3">
                                    <StatBar name={"Attack"} value={parseInt(JSON.stringify(info.stats[1].base_stat))}/>
                                </Row>
                                <Row className="justify-content-center mt-3">
                                    <StatBar name={"Defense"} value={parseInt(JSON.stringify(info.stats[2].base_stat))}/>
                                </Row>
                                <Row className="justify-content-center mt-3">
                                    <StatBar name={"Sp. Attack"} value={parseInt(JSON.stringify(info.stats[3].base_stat))}/>
                                </Row>
                                <Row className="justify-content-center mt-3">
                                    <StatBar name={"Sp. Defense"} value={parseInt(JSON.stringify(info.stats[4].base_stat))}/>
                                </Row>
                                <Row className="justify-content-center mt-3">
                                    <StatBar name={"Speed"}  value={parseInt(JSON.stringify(info.stats[5].base_stat))}/>
                                </Row>
                            </StatsBody>
                            <ColumnFooter>
                                <StatTotal>Total: {totalStats}</StatTotal>
                            </ColumnFooter>
                        </StatsColumn>
                        <ArtworkColumn xs={12} md={6}>
                            <ArtworkStack>
                                <ArtworkBody>{img}</ArtworkBody>
                                <ColumnFooter>
                                    {cryUrl && (
                                        <CryControls>
                                            <HiddenAudio
                                                ref={audioRef}
                                                src={cryUrl}
                                                preload="auto"
                                                onPlay={() => setIsCryPlaying(true)}
                                                onPause={() => setIsCryPlaying(false)}
                                                onEnded={() => setIsCryPlaying(false)}
                                                onError={() => {
                                                    setIsCryPlaying(false);
                                                    setCryError('This Pokémon cry could not be loaded.');
                                                }}
                                            />
                                            <CryButton
                                                type="button"
                                                onClick={playCry}
                                                aria-label={`${isCryPlaying ? 'Replay' : 'Play'} ${prettyName}'s cry`}
                                            >
                                                <FaPlay aria-hidden="true" />
                                                {isCryPlaying ? 'Replay cry' : 'Play cry'}
                                            </CryButton>
                                            {cryError && <CryMessage role="status">{cryError}</CryMessage>}
                                        </CryControls>
                                    )}
                                </ColumnFooter>
                            </ArtworkStack>
                        </ArtworkColumn>
                    </Row>
                </Col>
            </Row>
            <DefensiveCoverage type1={type1} type2={type2}/>
            <OffensiveCoverage type1={type1} type2={type2}/>
        </StatsContainer>
        : loading }
        </>
    );
}

export default PokemonStats;