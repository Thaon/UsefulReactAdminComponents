import React, { useEffect, useState } from "react";

import { Paper } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//drag and drop list stuff
const move = (
  source,
  destination,
  droppableSource,
  droppableDestination,
  clone,
  lastMoved
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  if (!clone) {
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
  } else {
    //TODO: MAKE SURE YOU CANNOT DRAG FROM RIGHT TO LEFT!
    const cloned = source.filter((X) => X.fakeId == lastMoved.draggableId)[0];
    let newClone = {};
    let max1 = getMax(source);
    let max2 = getMax(destination);
    newClone.id = cloned.id;
    newClone.fakeId = Math.max(max1, max2) + 1;
    newClone.name = cloned.name;
    destClone.splice(droppableDestination.index, 0, newClone);
  }
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getMax = (arr) => {
  let max = 0;
  arr.forEach((element) => {
    if (element.fakeId > max) max = element.fakeId;
  });
  return max;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: `1rem 5rem`,
  width: "50%",
});

const DragAndDropArea = (props) => {
  const [state, setState] = useState(props.state);
  const [lastMoved, setLastMoved] = useState(null);
  const [movedIndex, setMovedIndex] = useState(null);

  //drag and drop again
  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    setMovedIndex(destination.index);

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
      if (props.callback) props.callback(newState);
    } else {
      if (!props.bidirectional && destination.droppableId == 0) return;
      const result = move(
        state[sInd],
        state[dInd],
        source,
        destination,
        props.clone,
        lastMoved
      );
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
      if (props.callback) props.callback(newState, lastMoved, movedIndex);
    }
  }

  useEffect(() => {
    setState(props.state);
  }, [props.state]);

  return (
    <React.Fragment>
      <div style={{ display: "flex", width: "100%" }}>
        <DragDropContext
          onDragEnd={onDragEnd}
          onBeforeDragStart={(element) => {
            setLastMoved(element);
          }}
          style={{ width: "100%" }}
        >
          {state.map((el, ind) => (
            <Droppable
              key={ind}
              droppableId={`${ind}`}
              style={{ width: "50%" }}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {el.map((item, index) => (
                    <React.Fragment>
                      <Draggable
                        key={item.fakeId}
                        draggableId={item.fakeId.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Paper
                              elevation={2}
                              style={{
                                padding: "1rem",
                                minWidth: "5rem",
                                minHeight: "3rem",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                              }}
                              onClick={() => {
                                if (props.onClick) props.onClick(item);
                              }}
                            >
                              {item.name}
                              {/* {props.clone && ind != 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newState = [...state];
                                    newState[ind].splice(index, 1);
                                    setState(
                                      newState.filter((group) => group.length)
                                    );
                                  }}
                                >
                                  ❌
                                </button>
                              )} */}
                            </Paper>
                          </div>
                        )}
                      </Draggable>
                    </React.Fragment>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </React.Fragment>
  );
};

export default DragAndDropArea;
