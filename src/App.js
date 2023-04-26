import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

function App() {
  const [rankitems, setRankItems] = useState([]);

  const [newItemName, setNewItemName] = useState('');

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(rankitems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRankItems(items);
  }

  function handleAddItem() {
    if (newItemName.trim() !== '') {
      setRankItems([...rankitems, { id: Date.now().toString(), name: newItemName }]);
      setNewItemName('');
    }
  }

  function handleDeleteItem(id) {
    setRankItems(rankitems.filter((item) => item.id !== id));
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
          />
          <button onClick={handleAddItem}>Add</button>
        </div>
        <table>
          <tbody>
            <td>
              <ul className="rankitems">
                {rankitems.map(({id, name, thumb}, index) => {
                  return (
                    <li>
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
                      {rankitems.map(({id, name, thumb}, index) => {
                        return (
                          <Draggable key={id} draggableId={id} index={index}>
                            {(provided) => (
                              <li class="rankitem" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
