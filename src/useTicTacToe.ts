import { useCallback, useMemo, useState } from 'react';

export enum PlayerEnum {
  XPlayer = 'X',
  OPlayer = 'O',
}

export enum TicTacToeState {
  HasWinner = 'hasWinner',
  Draw = 'draw',
  OnGoing = 'onGoind',
}

interface IMove {
  position: number;
  player: PlayerEnum;
}

const winPossibilities = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const useTicTacToe = () => {
  const [moveList, setMoveList] = useState<IMove[]>([]);

  const currentPlayer = useMemo(() => {
    if (moveList.length === 0) {
      return PlayerEnum.XPlayer;
    }

    const { player: lastMovePlayer } = [...moveList].pop() as IMove;

    if (lastMovePlayer === PlayerEnum.XPlayer) {
      return PlayerEnum.OPlayer;
    }

    return PlayerEnum.XPlayer;
  }, [moveList]);

  const addMove = useCallback(
    (position: number): void => {
      setMoveList([...moveList, { player: currentPlayer, position }]);
    },
    [currentPlayer, moveList]
  );

  const winner: PlayerEnum | null = useMemo(() => {
    if (moveList.length < 5) {
      return null;
    }

    const { player: lastMovePlayer } = [...moveList].pop() as IMove;

    const currentPlayerMoves = moveList
      .filter(({ player }) => player === lastMovePlayer)
      .map(({ position }) => position);

    const wonPossibility = winPossibilities.find((possibility) =>
      possibility.every((position) => currentPlayerMoves.indexOf(position) >= 0)
    );

    return wonPossibility ? lastMovePlayer : null;
  }, [moveList]);

  const undo = useCallback(() => {
    setMoveList(moveList.slice(0, -1));
  }, [moveList]);

  const reset = useCallback(() => {
    setMoveList([]);
  }, []);

  const currentState = useMemo(() => {
    if (winner) {
      return TicTacToeState.HasWinner;
    }

    if (moveList.length === 9) {
      return TicTacToeState.Draw;
    }

    return TicTacToeState.OnGoing;
  }, [winner, moveList]);

  return {
    currentState,
    winner,
    addMove,
    moveList,
    undo,
    reset,
  };
};

export default useTicTacToe;
