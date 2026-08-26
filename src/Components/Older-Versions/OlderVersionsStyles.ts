import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ToolPage } from '../Tools/ToolLayout';

export const ArchivePage = styled(ToolPage)`
  padding: clamp(2.75rem, 7vh, 4rem) 1rem clamp(1rem, 2vh, 1.5rem);

  > header {
    margin-bottom: clamp(2.25rem, 5vh, 3rem);
  }

  > header h1 {
    font-size: clamp(2.25rem, 7vh, 4rem);
  }

  > header p:last-child {
    margin-top: 0.4rem;
    line-height: 1.4;
  }
`;

export const ArchivePanel = styled.section``;

export const ArchiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
  max-width: 960px;
  margin: 0 auto;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const VersionCard = styled.article`
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  color: var(--text-primary, #fffaf1);
  background: #383c42;
  border: 1px solid #4a4e55;
  border-radius: 16px;
  box-shadow: 0 5px 0 #202226;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    color: var(--text-primary, #fffaf1);
    background: #3e4249;
    border-color: #686d76;
    box-shadow: 0 7px 0 #202226;
    text-decoration: none;
    transform: translateY(-2px);
  }

`;

export const PreviewLink = styled.a`
  display: block;

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.8);
    outline-offset: -4px;
  }
`;

export const ImageFrame = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #24272b;
  border-bottom: 1px solid #4a4e55;

  > span {
    display: block !important;
    width: 100%;
    height: 100%;
  }
`;

export const Image = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;

  ${PreviewLink}:hover & {
    transform: scale(1.025);
  }
`;

export const CardBody = styled.div`
  display: flex;
  min-height: 155px;
  padding: clamp(1rem, 2.5vw, 1.25rem);
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

export const VersionLabel = styled.span`
  margin-bottom: 0.45rem;
  color: #ff8799;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: var(--text-primary, #fffaf1);
  font-size: clamp(1.35rem, 3vw, 1.65rem);
  font-weight: 850;
  letter-spacing: -0.02em;
`;

export const CardDescription = styled.p`
  margin: 0.35rem 0 0.9rem;
  color: var(--text-secondary, #b8bbc2);
  font-size: 0.92rem;
  line-height: 1.55;
`;

export const CardActions = styled.div`
  display: flex;
  margin-top: auto;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

export const CardLink = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  min-height: 38px;
  padding: 0.45rem 0.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: var(--text-primary, #fffaf1);
  background: ${({ $primary }) => ($primary ? '#d72d38' : '#484c53')};
  border: 1px solid ${({ $primary }) => ($primary ? '#ef5963' : '#686d76')};
  border-radius: 10px;
  box-shadow: 0 2px 0 ${({ $primary }) => ($primary ? '#8e1821' : '#24272b')};
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  svg {
    width: 0.65rem;
    height: 0.65rem;
  }

  &:hover {
    color: var(--text-primary, #fffaf1);
    background: ${({ $primary }) => ($primary ? '#e43a46' : '#555a62')};
    box-shadow: 0 3px 0 ${({ $primary }) => ($primary ? '#8e1821' : '#24272b')};
    text-decoration: none;
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: 0 1px 0 ${({ $primary }) => ($primary ? '#8e1821' : '#24272b')};
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 222, 0, 0.8);
    outline-offset: 3px;
  }
`;
