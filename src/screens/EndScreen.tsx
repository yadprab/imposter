import { Collapse, Group, Stack, Text, Title } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconGavel,
  IconHeartFilled,
  IconHome,
  IconRefresh,
  IconSkull,
} from "@tabler/icons-react";
import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { CandyButton, CandyIconButton } from "../components/CandyButton";
import { useGameStore } from "../game/store";
import type { Role } from "../game/types";

const IMPOSTER_INSTRUCTIONS = [
  "1. Each player gives one clue, in turn.",
  "2. Repeat a few rounds. Imposters bluff.",
  "3. Vote out loud. Host announces who's ejected.",
  "4. Host reveals if you caught the imposter.",
];

const MAFIA_INSTRUCTIONS = [
  '1. Night: host calls "eyes closed."',
  "2. Mafia opens eyes, silently picks a target.",
  "3. Doctor opens, picks one to save.",
  "4. Day: host announces who (if anyone) died. Discuss and vote out loud.",
  "5. God already knows the mafia — drop clues without getting killed.",
  "6. Mafia wins if they equal/outnumber the town. Town wins if all mafia are out.",
];

const ROLE_LABEL: Record<Role, string> = {
  imposter: "Imposter",
  crew: "Crew",
  mafia: "Mafia",
  doctor: "Doctor",
  god: "God",
  villager: "Villager",
};

const IMPOSTER_ROLE_ORDER: Role[] = ["imposter", "crew"];
const MAFIA_ROLE_ORDER: Role[] = ["mafia", "doctor", "god", "villager"];

function phaseLabel(index: number): string {
  return `${index % 2 === 0 ? "Night" : "Day"} ${Math.floor(index / 2) + 1}`;
}

export function EndScreen() {
  const round = useGameStore((s) => s.round);
  const reset = useGameStore((s) => s.reset);
  const nextRoundSetup = useGameStore((s) => s.nextRoundSetup);
  const [showKey, setShowKey] = useState(false);
  const [kills, setKills] = useState<Record<number, number>>({});
  const [phaseIndex, setPhaseIndex] = useState(0);

  if (!round) return null;
  const isMafia = round.mode === "mafia";
  const instructions = isMafia ? MAFIA_INSTRUCTIONS : IMPOSTER_INSTRUCTIONS;

  const isNight = phaseIndex % 2 === 0;
  const isDead = (id: number) => id in kills;
  const toggleKill = (id: number) =>
    setKills((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
      } else {
        next[id] = phaseIndex;
      }
      return next;
    });

  const aliveMafia = round.players.filter(
    (p) => p.role === "mafia" && !isDead(p.id),
  ).length;
  const aliveTown = round.players.filter(
    (p) => p.role !== "mafia" && !isDead(p.id),
  ).length;
  const anyDead = Object.keys(kills).length > 0;
  const townWins = isMafia && anyDead && aliveMafia === 0;
  const mafiaWins =
    isMafia && anyDead && aliveMafia > 0 && aliveMafia >= aliveTown;
  const gameOver = townWins || mafiaWins;
  const winLine =
    aliveMafia === 0
      ? "Town wins — all mafia are out."
      : aliveMafia >= aliveTown
        ? "Mafia wins — they equal or outnumber the town."
        : "Game on.";

  const grouped: Record<string, typeof round.players> = {};
  for (const p of round.players) {
    if (!grouped[p.role]) grouped[p.role] = [];
    grouped[p.role].push(p);
  }
  const roleOrder = isMafia ? MAFIA_ROLE_ORDER : IMPOSTER_ROLE_ORDER;

  return (
    <Stack gap="lg" style={{ flex: 1 }} mt="md">
      <Stack gap={6} align="center">
        <div className="ribbon">
          {isMafia ? "Night falls" : "Round in play"}
        </div>
        <Title
          className="wordmark"
          style={{ fontSize: 44 }}
          ta="center"
          mt="sm"
        >
          PLAY!
        </Title>
        <Text
          c="white"
          size="sm"
          ta="center"
          maw={320}
          style={{ opacity: 0.85 }}
        >
          {isMafia
            ? "Host moderates the night/day phases out loud. Game knows nothing — you run it."
            : "Discuss out loud, drop clues, then vote together. The host knows the truth."}
        </Text>
      </Stack>

      {isMafia && gameOver && (
        <div
          className={
            townWins ? "victory-card victory-card--town" : "victory-card victory-card--mafia"
          }
        >
          <Stack gap="sm" align="center">
            <div className="ribbon">Game over</div>
            <Title
              order={1}
              className="wordmark"
              style={{ fontSize: 40, lineHeight: 1.1, marginTop: 4 }}
              ta="center"
            >
              {townWins ? "TOWN WINS" : "MAFIA WINS"}
            </Title>
            <Text size="sm" c="white" ta="center" style={{ opacity: 0.9 }}>
              {townWins
                ? "Every mafia has been caught."
                : "Mafia equal or outnumber the town — they take over."}
            </Text>
            <Text size="xs" c="white" ta="center" style={{ opacity: 0.7 }}>
              Final roles revealed below.
            </Text>
          </Stack>
        </div>
      )}

      {isMafia && !gameOver && (
        <div
          className={isNight ? "phase-card phase-card--night" : "phase-card phase-card--day"}
        >
          <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
            <CandyIconButton
              color="violet"
              onClick={() => setPhaseIndex((i) => Math.max(0, i - 1))}
              disabled={phaseIndex === 0}
              ariaLabel="previous phase"
            >
              <IconChevronLeft size={20} />
            </CandyIconButton>
            <Stack gap={2} align="center" style={{ flex: 1 }}>
              <Group gap={6} align="center">
                {isNight ? (
                  <IconSkull size={20} color="#fff" />
                ) : (
                  <IconGavel size={20} color="#fff" />
                )}
                <Title order={3} c="white" style={{ letterSpacing: "0.08em" }}>
                  {phaseLabel(phaseIndex).toUpperCase()}
                </Title>
              </Group>
              <Text size="xs" c="white" ta="center" style={{ opacity: 0.85 }}>
                {isNight
                  ? "Eyes closed. Mafia pick a target, Doctor saves, God watches."
                  : "Eyes open. Talk it out, then vote someone out."}
              </Text>
            </Stack>
            <CandyIconButton
              color="green"
              onClick={() => setPhaseIndex((i) => i + 1)}
              ariaLabel="next phase"
            >
              <IconChevronRight size={20} />
            </CandyIconButton>
          </Group>
        </div>
      )}

      {isMafia ? (
        <div className="candy-card">
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text
                size="xs"
                tt="uppercase"
                fw={800}
                c="yellow.3"
                style={{ letterSpacing: "0.2em" }}
              >
                Kill tracker
              </Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                Tap to mark
              </Text>
            </Group>
            <Stack gap={6}>
              {round.players.map((p) => {
                const dead = isDead(p.id);
                const diedNight = dead && kills[p.id] % 2 === 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={dead ? "kill-row kill-row--dead" : "kill-row"}
                    onClick={() => toggleKill(p.id)}
                  >
                    <Avatar seed={p.seed} size={30} />
                    <span className="kill-row-name">{p.name}</span>
                    {!dead && (
                      <span className="kill-tag kill-tag--alive">
                        <IconHeartFilled size={13} /> Alive
                      </span>
                    )}
                    {dead && (
                      <span
                        className={
                          diedNight
                            ? "kill-tag kill-tag--night"
                            : "kill-tag kill-tag--day"
                        }
                      >
                        {diedNight ? (
                          <IconSkull size={13} />
                        ) : (
                          <IconGavel size={13} />
                        )}{" "}
                        {phaseLabel(kills[p.id])}
                      </span>
                    )}
                  </button>
                );
              })}
            </Stack>
            <Text size="xs" c="white" ta="center" style={{ opacity: 0.6 }}>
              Tap a living name to eliminate them in {phaseLabel(phaseIndex)}. Tap
              again to undo.
            </Text>
          </Stack>
        </div>
      ) : (
        <div className="candy-card">
          <Stack gap="sm">
            <Text
              size="xs"
              tt="uppercase"
              fw={800}
              c="yellow.3"
              style={{ letterSpacing: "0.2em" }}
            >
              In play
            </Text>
            <Group gap="xs" wrap="wrap">
              {round.players.map((p) => (
                <span key={p.id} className="candy-chip">
                  <Avatar seed={p.seed} size={26} />
                  <span>{p.name}</span>
                </span>
              ))}
            </Group>
          </Stack>
        </div>
      )}

      <div className="candy-card">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Stack gap={0}>
              <Text fw={700} c="white" size="lg">
                Answer key
              </Text>
              <Text size="xs" c="white" style={{ opacity: 0.7 }}>
                Host only — don't let players peek
              </Text>
            </Stack>
            <CandyButton
              color={showKey ? "orange" : "violet"}
              size="sm"
              onClick={() => setShowKey((v) => !v)}
              icon={showKey ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            >
              {showKey ? "Hide" : "Show"}
            </CandyButton>
          </Group>
          <Collapse in={showKey || gameOver}>
            <Stack gap="sm" pt="xs">
              {isMafia && (
                <div className="win-banner">
                  <Group justify="center" gap="lg">
                    <Text size="sm" fw={800} c="white">
                      Mafia alive: {aliveMafia}
                    </Text>
                    <Text size="sm" fw={800} c="white">
                      Town alive: {aliveTown}
                    </Text>
                  </Group>
                  <Text size="xs" ta="center" c="yellow.3" fw={700} mt={4}>
                    {winLine}
                  </Text>
                </div>
              )}
              {!isMafia && (
                <Stack gap={2}>
                  <Text
                    size="xs"
                    tt="uppercase"
                    fw={800}
                    c="yellow.3"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {round.category}
                  </Text>
                  <Title order={2} c="white">
                    {round.word}
                  </Title>
                </Stack>
              )}
              {roleOrder.map((role) =>
                grouped[role]?.length ? (
                  <Stack key={role} gap={4}>
                    <Text
                      size="xs"
                      tt="uppercase"
                      fw={800}
                      c="white"
                      style={{ letterSpacing: "0.2em", opacity: 0.85 }}
                    >
                      {ROLE_LABEL[role]}
                      {grouped[role].length > 1 ? "s" : ""}
                    </Text>
                    <Group gap={6} wrap="wrap">
                      {grouped[role].map((p) => (
                        <span
                          key={p.id}
                          className={
                            role === "imposter" || role === "mafia"
                              ? "candy-chip candy-chip--pink"
                              : "candy-chip"
                          }
                        >
                          <Avatar seed={p.seed} size={22} />
                          <span>{p.name}</span>
                        </span>
                      ))}
                    </Group>
                  </Stack>
                ) : null,
              )}
            </Stack>
          </Collapse>
        </Stack>
      </div>

      <div className="candy-card">
        <Stack gap="xs">
          <Text
            size="xs"
            tt="uppercase"
            fw={800}
            c="yellow.3"
            style={{ letterSpacing: "0.2em" }}
          >
            How to play
          </Text>
          {instructions.map((line) => (
            <Text key={line} size="sm" c="white">
              {line}
            </Text>
          ))}
        </Stack>
      </div>

      <div style={{ flex: 1 }} />

      <Stack gap="sm">
        <CandyButton
          color="green"
          onClick={nextRoundSetup}
          icon={<IconRefresh size={20} />}
        >
          Next round
        </CandyButton>
        <CandyButton
          color="violet"
          onClick={reset}
          icon={<IconHome size={20} />}
        >
          New game
        </CandyButton>
      </Stack>
    </Stack>
  );
}
