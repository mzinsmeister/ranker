import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import { Base64 } from 'js-base64';

function App() {  
  const [rankItems, setRankItemsState] = useState(() => {
      const encodedList = window.location.hash.slice(1); // Extract the encoded list from the URL hash; // Extract the encoded list from the URL hash
      if (encodedList) {
        try {
          return JSON.parse(Base64.atob(encodedList)); // Decode the list using Base64 encoding
        } catch (error) {
          console.error('Error decoding list from URL:', error);
        }
      } else {
        return [];
      }
  });

  const [newItemName, setNewItemName] = useState('');

  function putDataToURL(rankItems) {
    const encodedList = Base64.btoa(JSON.stringify(rankItems)); // Encodes the list using Base64 encoding
    const url = `#${encodedList}`; // Builds the URL with the encoded list behind a hash
    window.history.replaceState(undefined, undefined, url); // Navigates to the new URL with the encoded list behind a hash
  }

  function setRankItems(rankItems) {
    setRankItemsState(rankItems);
    putDataToURL(rankItems);
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(rankItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRankItems(items);
  }

  function handleAddItem() {
    if (newItemName.trim() !== '') {
      setRankItems([...rankItems, { id: Date.now().toString(), name: newItemName }]);
      setNewItemName('');
    }
  }

  function handleDeleteItem(id) {
    setRankItems(rankItems.filter((item) => item.id !== id));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ranker</h1>
        <div className="add-item-container">
          <input
            type="text"
            placeholder="Add a new item..."
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
            onKeyDown={(event) => {if (event.key === 'Enter') handleAddItem()}}
          />
          <button onClick={handleAddItem}>Add</button>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <ul className="rankitems">
                  {rankItems.map((_, index) => {
                    return (
                      <li key={index}>
                        <p>
                          { index }
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </td>
              <td>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="rankitems">
                    {(provided) => (
                      <ul className="rankitems" {...provided.droppableProps} ref={provided.innerRef}>
                        {rankItems.map(({id, name}, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
                              {(provided) => (
                                <li className="rankitem" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <p>
                                    { name }
                                  </p>
                                  <button onClick={() => handleDeleteItem(id)}>Delete</button>
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </td>
            </tr>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
