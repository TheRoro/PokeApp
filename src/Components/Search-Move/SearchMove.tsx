import React from 'react';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import MoveInfo from './MoveInfo';
import Autocomplete from '../Tools/SearchEngine/SearchEngine';
import moveList from '../Tools/MoveList';
import PokeBall from '../../Assets/pokeapp.png';
import ApiError, { ApiErrorInfo } from '../Tools/ApiError/ApiError';
import { describeApiError } from '../Tools/ApiError/apiErrors';
import { ToolPageHeader } from '../Tools/ToolLayout';
import { selectDiscoveryMoves } from './moveDiscovery';
import typeIcons from '../../Assets/type-icons';
import DiscoveryTile, {
  DiscoveryContent,
  DiscoveryGrid,
  DiscoveryImage,
  DiscoverySearch,
  DiscoverySearchControl,
} from '../Tools/DiscoveryTile';
import { getTypeColor } from '../Tools/TypeBadge';

import { Route, Routes, useNavigate, useParams } from 'react-router-dom';

import {
  SearchContainer,
  LoadingCol,
  LoadingImg,
  MoveLoading,
} from './SearchMoveStyles';

const formatName = (value: string) =>
  value.trim().replace(/\s+/g, '-').toLowerCase();

const formatPretty = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const MoveDetailsRoute: React.FC = () => {
  const { name = '' } = useParams<'name'>();
  const [moveInfo, setMoveInfo] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ApiErrorInfo | null>(null);
  const [retry, setRetry] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    setMoveInfo(null);
    setError(null);
    setLoading(true);

    axios
      .get(`https://pokeapi.co/api/v2/move/${formatName(name)}/`, {
        signal: controller.signal,
      })
      .then(response => setMoveInfo(response.data))
      .catch(requestError => {
        if (!axios.isCancel(requestError)) {
          setError(describeApiError(requestError, 'move'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [name, retry]);

  if (loading) {
    return (
      <MoveLoading role="status" aria-label="Loading move">
        <LoadingCol>
          <LoadingImg src={PokeBall} alt="" />
        </LoadingCol>
      </MoveLoading>
    );
  }

  if (error) {
    return <ApiError error={error} onRetry={() => setRetry(value => value + 1)} />;
  }

  return moveInfo
    ? <MoveInfo moveInfo={moveInfo} moveName={formatPretty(moveInfo.name)} />
    : null;
};

const SearchMove: React.FC = () => {
  const navigate = useNavigate();
  const [discoveryMoves] = React.useState(() => selectDiscoveryMoves(6));
  const [prettyName, setPrettyName] = React.useState('');
  const searchMove = (name: string) => {
    const apiName = formatName(name);
    if (!apiName) return;
    navigate(apiName);
  };

  const onValueChange = (val: string, code: number) => {
    const apiName = formatName(val);
    setPrettyName(formatPretty(val));
    if (code === 13) {
      searchMove(apiName);
    }
  };

  return (
    <SearchContainer>
      <Routes>
        <Route
          path=":name"
          element={<MoveDetailsRoute />}
        />
        <Route
          index
          element={
            <Container>
              <DiscoveryContent>
                <ToolPageHeader
                  eyebrow="Move database"
                  title="Find a move"
                  description="Search by name, or discover a random move from six different types below."
                />
                <DiscoverySearch>
                  <DiscoverySearchControl>
                    <Autocomplete
                      options={moveList}
                      onChangeValue={onValueChange}
                      val={prettyName}
                      label="Search moves"
                    />
                  </DiscoverySearchControl>
                </DiscoverySearch>
                <DiscoveryGrid>
                  {discoveryMoves.map(move => {
                    const prettyMove = formatPretty(move.name);
                    return (
                      <DiscoveryTile
                        key={move.type}
                        ariaLabel={`View ${prettyMove}, ${move.type} type`}
                        color={getTypeColor(move.type)}
                        label={prettyMove}
                        onClick={() => searchMove(move.name)}
                      >
                        <DiscoveryImage src={typeIcons[move.type]} alt="" />
                      </DiscoveryTile>
                    );
                  })}
                </DiscoveryGrid>
              </DiscoveryContent>
            </Container>
          }
        />
      </Routes>
    </SearchContainer>
  );
};

export default SearchMove;
