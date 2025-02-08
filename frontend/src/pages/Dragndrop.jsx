import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import calendar from "../assets/calendar.png";
import drive from "../assets/drive.png"
import gmail from "../assets/gmail.png"
import googlesheets from "../assets/googlesheets.png"    

const Dragndrop = () => {
    const [leftApps, setLeftApps] = useState([
        { id: "app1", name: "Gmail" ,img:gmail},
        { id: "app2", name: "Google Drive",img:drive },
        { id: "app3", name: "Google sheets" ,img:googlesheets},
        { id: "app4", name: "Google calendar" ,img:calendar},
        // { id: "app5", name: "Notion" },
    ]);

    const [rightApps, setRightApps] = useState([
        { id: "app6", name: "Gmail" ,img:gmail},
        { id: "app7", name: "Google Drive",img:drive },
        { id: "app8", name: "Google sheets" ,img:googlesheets},
        { id: "app9", name: "Google calendar" ,img:calendar},
    ]);

    const [workspaceLeft, setWorkspaceLeft] = useState([]);
    const [workspaceRight, setWorkspaceRight] = useState([]);

    useEffect(() => {
        console.log("Workspace Left updated:", workspaceLeft);
        console.log("Workspace Right updated:", workspaceRight);
    }, [workspaceLeft, workspaceRight]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Map list states dynamically
        const listMap = {
            left: { state: leftApps, setState: setLeftApps },
            right: { state: rightApps, setState: setRightApps },
            workspaceLeft: { state: workspaceLeft, setState: setWorkspaceLeft },
            workspaceRight: { state: workspaceRight, setState: setWorkspaceRight },
        };

        const sourceList = [...listMap[source.droppableId].state];
        const destinationList = [...listMap[destination.droppableId].state];

        const [movedItem] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, movedItem);

        listMap[source.droppableId].setState(sourceList);
        listMap[destination.droppableId].setState(destinationList);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-screen w-full">
                {/* Left Sidebar */}
                <div className="w-1/5 bg-slate-900 p-5">
                    <h3 className="text-lg font-semibold text-white">Available Apps (Left)</h3>
                    <Droppable droppableId="left">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-slate-950 p-3 rounded-md min-h-[100px] "
                            >
                                {leftApps.map((app, index) => (
                                    <Draggable key={app.id} draggableId={app.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-2 my-4 bg-white border border-gray-300 text-center cursor-move shadow-sm rounded-md"
                                            >
                                                <img src={app.img} alt="app" className="w-10 h-10 mx-auto"/>
                                                {app.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* Middle Workspace */}
                <div className="flex-1 bg-slate-950 p-5 flex flex-col items-center">
                    <h1 className="text-white text-3xl mt-2 mb-4">Drag and drop your apps here!</h1>
                    {/* <h3 className="text-lg font-semibold">Workspace</h3> */}
                    <div className="flex w-full justify-between gap-4">
                        {/* Left Workspace Droppable */}
                        <Droppable droppableId="workspaceLeft">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="w-full min-h-[200px] bg-white p-3 rounded-md border border-gray-300 mt-3"
                                >
                                    {workspaceLeft.map((app, index) => (
                                        <Draggable key={app.id} draggableId={app.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 my-2 bg-white border border-gray-300 text-center cursor-move shadow-sm rounded-md"
                                                >
                                                    <img src={app.img} alt="app" className="w-10 h-10 mx-auto"/>
                                                    {app.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Right Workspace Droppable */}
                        <Droppable droppableId="workspaceRight">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="w-full min-h-[200px] bg-white p-3 rounded-md border border-gray-300 mt-3"
                                >
                                    {workspaceRight.map((app, index) => (
                                        <Draggable key={app.id} draggableId={app.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 my-2 bg-white border border-gray-300 text-center cursor-move shadow-sm rounded-md"
                                                >
                                                    <img src={app.img} alt="app" className="w-10 h-10 mx-auto"/>
                                                    {app.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div class="mt-8">
  <button type="button" class="transition group flex h-14 w-48 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1.5px] text-white duration-300 hover:bg-gradient-to-l hover:shadow-2xl hover:shadow-blue-600/30 shadow-blue-500/30 shadow-lg">
    <div class=" text-2xl px-8 py-4 flex h-full w-full items-center justify-center rounded-xl bg-gray-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 group-hover:transition group-hover:duration-300 group-hover:ease-in-out hover:shadow-blue-600/30">
      Click me
    </div>
  </button>
</div>




                </div>

                {/* Right Sidebar */}
                <div className="w-1/5 bg-slate-900 p-5">
                    <h3 className="text-lg font-semibold text-white">Available Apps (Right)</h3>
                    <Droppable droppableId="right">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-slate-950 p-3 rounded-md min-h-[100px]"
                            >
                                {rightApps.map((app, index) => (
                                    <Draggable key={app.id} draggableId={app.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-2 my-4 bg-white border border-gray-300 text-center cursor-move shadow-sm rounded-md"
                                            >
                                                <img src={app.img} alt="app" className="w-10 h-10 mx-auto"/>
                                                {app.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
};

export default Dragndrop;
