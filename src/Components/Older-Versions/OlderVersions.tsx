import React from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { ToolPageHeader } from '../Tools/ToolLayout';
import Pokeffective from './Images/Pokeffective.jpg';
import PokeffectiveRetro from './Images/Pokeffective-Retro.jpg';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
  ArchivePage,
  ArchivePanel,
  ArchiveGrid,
  CardActions,
  CardBody,
  CardDescription,
  CardLink,
  CardTitle,
  Image,
  ImageFrame,
  PreviewLink,
  VersionCard,
  VersionLabel,
} from './OlderVersionsStyles';

const OlderVersions: React.FC = () => {
  return (
    <ArchivePage>
      <ToolPageHeader
        eyebrow="PokéApp archive"
        title="Older Versions"
        description="Revisit earlier generations of the PokéApp experience."
        wrapDescription
      />

      <ArchivePanel>
        <ArchiveGrid>
          <VersionCard>
            <PreviewLink
              href="https://TheRoro.github.io/Pokeffective-Retro/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Pokeffective Retro"
            >
              <ImageFrame>
                <Image
                  effect="blur"
                  src={PokeffectiveRetro}
                  alt="Pokeffective Retro interface"
                />
              </ImageFrame>
            </PreviewLink>
            <CardBody>
              <VersionLabel>Retro edition</VersionLabel>
              <CardTitle>Pokeffective Retro</CardTitle>
              <CardDescription>
                The original pixel inspired Pokédex experience.
              </CardDescription>
              <CardActions>
                <CardLink
                  $primary
                  href="https://TheRoro.github.io/Pokeffective-Retro/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open app
                  <FaExternalLinkAlt aria-hidden="true" />
                </CardLink>
                <CardLink
                  href="https://github.com/TheRoro/Pokeffective-Retro"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub aria-hidden="true" />
                  GitHub repo
                </CardLink>
              </CardActions>
            </CardBody>
          </VersionCard>

          <VersionCard>
            <PreviewLink
              href="https://TheRoro.github.io/Pokeffective/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Pokeffective"
            >
              <ImageFrame>
                <Image
                  effect="blur"
                  src={Pokeffective}
                  alt="Pokeffective interface"
                />
              </ImageFrame>
            </PreviewLink>
            <CardBody>
              <VersionLabel>Classic edition</VersionLabel>
              <CardTitle>Pokeffective</CardTitle>
              <CardDescription>
                The previous generation of the modern PokéApp.
              </CardDescription>
              <CardActions>
                <CardLink
                  $primary
                  href="https://TheRoro.github.io/Pokeffective/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open app
                  <FaExternalLinkAlt aria-hidden="true" />
                </CardLink>
                <CardLink
                  href="https://github.com/TheRoro/Pokeffective"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub aria-hidden="true" />
                  GitHub repo
                </CardLink>
              </CardActions>
            </CardBody>
          </VersionCard>
        </ArchiveGrid>
      </ArchivePanel>
    </ArchivePage>
  );
};

export default OlderVersions;
