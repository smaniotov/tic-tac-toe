import { chunk } from 'lodash';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import useTicTacToe, { TicTacToeState } from './useTicTacToe';
import 'skeleton-css/css/skeleton.css';

const TitleContainer = styled.h2`
  color: #223;
  width: 100%;
  text-align: center;
`;

const CenterFlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cell = styled.label`
  height: 100px;
  width: 100px;
  background-color: lightgrey;
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  &:hover {
    background-color: lightsalmon;
  }
`;

const EndGameOverlay = styled(CenterFlexDiv)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 30px;
`;

const [firstRow, secondRow, thirdRow] = chunk(
  new Array(9).fill(0).map((_, i) => i),
  3
);

const App = () => {
  const { addMove, currentState, moveList, undo, winner, reset } =
    useTicTacToe();

  const renderRow = useCallback(
    (row: number[]) => (
      <CenterFlexDiv>
        {row.map((rowNumber: number) => {
          const currentCellPlayer = moveList.find(
            ({ position }) => position === rowNumber
          )?.player;
          const isChecked = Boolean(currentCellPlayer);
          const id = `${rowNumber}-cell`;

          return (
            <Cell htmlFor={id}>
              <input
                id={id}
                style={{ display: 'none' }}
                type="checkbox"
                checked={isChecked}
                onChange={(_) => !isChecked && addMove(rowNumber)}
                key={rowNumber}
              />
              <span>{currentCellPlayer || '-'}</span>
            </Cell>
          );
        })}
      </CenterFlexDiv>
    ),
    [moveList, addMove]
  );

  const overlayLabel = useMemo(() => {
    switch (currentState) {
      case TicTacToeState.Draw:
        return 'Draw';
      case TicTacToeState.HasWinner:
        return `Winner: ${winner}`;
      default:
        return null;
    }
  }, [currentState, winner]);

  return (
    <main>
      <TitleContainer>Tic Tac Toe</TitleContainer>
      <CenterFlexDiv style={{ marginTop: 16 }}>
        <button className="button" onClick={reset} style={{ marginRight: 16 }}>
          Reset
        </button>
        <button className="button" onClick={undo}>
          Undo
        </button>
      </CenterFlexDiv>
      <CenterFlexDiv style={{ position: 'relative', marginTop: 16 }}>
        {currentState !== TicTacToeState.OnGoing && (
          <EndGameOverlay>{overlayLabel}</EndGameOverlay>
        )}
        <div>
          {renderRow(firstRow)}
          {renderRow(secondRow)}
          {renderRow(thirdRow)}
        </div>
      </CenterFlexDiv>
    </main>
  );
};

export default App;
