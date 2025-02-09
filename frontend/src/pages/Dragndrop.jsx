import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import calendar from "../assets/calendar.png";
import drive from "../assets/drive.png"
import gmail from "../assets/gmail.png"
import googlesheets from "../assets/googlesheets.png"
import googlemeet from "../assets/gmeet.jpg"
import slack from "../assets/slack.png"
import '../App.css';
import axios from "axios";

const Dragndrop = () => {
    const [email, setEmail] = useState(''); // State variable to store the email input
    const [message, setMessage] = useState(''); // State variable to store the message input
    const [date, setDate] = useState(''); // State variable to store the date input
    const [time, setTime] = useState(''); // State variable to store the time input
    const [leftApps, setLeftApps] = useState([
        { id: "app1", name: "Gmail", img: gmail, functions: ["Summarize Mail", "Extract Attachments", "Send Mail"], side: "left" },
        { id: "app2", name: "Google Drive", img: drive, functions: ["Upload File", "Organize Files", "Share Files"], side: "left" },
        { id: "app3", name: "Google Sheets", img: googlesheets, functions: ["Create Spreadsheet", "Calculate Formulas", "Share Sheet"], side: "left" },
        { id: "app4", name: "Google Calendar", img: calendar, functions: ["Create Event", "Set Reminder", "View Schedule"], side: "left" },
        { id: "app5", name: "Google Meet", img: googlemeet, functions: ["Start Meeting", "Join Meeting", "Record Meeting"], side: "left" },
        { id: "app11", name: "Slack", img: slack, functions: ["Send Message", "Schedule Message"], side: "left" },
    ]);

    const [rightApps, setRightApps] = useState([
        { id: "app6", name: "Gmail", img: gmail, functions: ["Summarize Mail", "Extract Attachments", "Send Mail"], side: "right" },
        { id: "app7", name: "Google Drive", img: drive, functions: ["Upload File", "Organize Files", "Share Files"], side: "right" },
        { id: "app8", name: "Google Sheets", img: googlesheets, functions: ["Create Spreadsheet", "Calculate Formulas", "Share Sheet"], side: "right" },
        { id: "app9", name: "Google Calendar", img: calendar, functions: ["Create Event", "Set Reminder", "View Schedule"], side: "right" },
        { id: "app10", name: "Google Meet", img: googlemeet, functions: ["Start Meeting", "Join Meeting", "Record Meeting"], side: "right" },
        { id: "app12", name: "Slack", img: slack, functions: ["Send Message", "Schedule Message"], side: "right" },
    ]);
    const [selectedApp, setSelectedApp] = useState(null); // Track selected app
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [isInputModelOpen, setIsInputModelOpen] = useState(false); // Track input modal visibility
    const [selectedFunctions, setSelectedFunctions] = useState([]); // Store selected functions
    const handleFunctionClick = (func, side) => {
        // Add function from left and right to the selected functions array
        if (selectedFunctions[0] === "Summarize Mail") {
            setIsInputModelOpen(true);

        }
        setIsModalOpen(false);
        if (side === "left") {
            if (!selectedFunctions[0]) {
                setSelectedFunctions([func, selectedFunctions[1] || ""]);
            } else {
                setSelectedFunctions([func, selectedFunctions[1]]);
            }
        } else if (side === "right") {
            if (!selectedFunctions[1]) {
                setSelectedFunctions([selectedFunctions[0] || "", func]);
            } else {
                setSelectedFunctions([selectedFunctions[0], func]);
            }
        }
    };

    const handleRun = async (selectedFunctions) => {
        console.log("clicked")
        if(selectedFunctions[0] === "Schedule message"){
            try {
                // Send a request to the backend to trigger the process
                const response = await fetch('http://localhost:5000/schedule-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: 'Hello, this is a scheduled message!' }),
                });

                if (response.ok) {
                    console.log('Request successful');
                    alert("Message scheduled successfully");
                } else {
                    console.log('Request failed');
                }
            } catch (error) {
                console.error('Error occurred while scheduling message:', error);
            }
        }
        if (selectedFunctions[0] === "Extract Attachments" && selectedFunctions[1] === "Upload File") {
            try {
                // Send a request to the backend to trigger the process
                const response = await fetch('http://localhost:5000/upload-attachments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log('Request successful');
                    alert("Attachments Extracted and Uploaded to Google Drive");
                } else {
                    console.log('Request failed');
                }
            } catch (error) {
                console.error('Error occurred while uploading attachments:', error);
            }
        }
    }
    const handleAppClick = (app) => {
        setSelectedApp(app);
        setIsModalOpen(true); // Show the modal when an app is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedApp(null);
        setIsInputModelOpen(false);
    };

    const handleScheduleMessage = async () => {
        if (!message || !date || !time) {
          alert("Please enter all fields: message, date, and time.");
          return;
        }
    console.log(message, date, time);
        try {
          const response = await axios.post("http://localhost:5000/schedule-message", {
            message,
            date,
            time,
          });
    
          if (response.status === 200) {
            alert("Message scheduled successfully!");
            closeModal(); // Close modal after scheduling
          }
        } catch (error) {
            console.log(error)
          alert(`Error: ${error.response?.data?.error || "Failed to schedule message"}`);
        }
      };
    const [workspaceLeft, setWorkspaceLeft] = useState([]);
    const [workspaceRight, setWorkspaceRight] = useState([]);

    useEffect(() => {
        console.log("Workspace Left updated:", workspaceLeft);
        console.log("Workspace Right updated:", workspaceRight);
    }, [workspaceLeft, workspaceRight]);
    useEffect(() => {
        console.log("Selected Functions updated:", selectedFunctions);
    }, [selectedFunctions]);

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
                    <h3 className="text-lg font-semibold text-white">Available Apps</h3>
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
                                                onClick={() => handleAppClick(app)} // Show modal on click
                                            >
                                                <img src={app.img} alt="app" className="w-10 h-10 mx-auto" />
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
                    <div className="flex w-full justify-between gap-10">
                        {/* Left Workspace Droppable */}
                        <Droppable droppableId="workspaceLeft">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="w-full min-h-[200px] bg-slate-900 p-3 rounded-md shadow-md shadow-white mt-3 neon-effect"
                                >
                                    {workspaceLeft.map((app, index) => (
                                        <Draggable key={app.id} draggableId={app.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 my-2 bg-white border border-gray-300 text-center cursor-pointer shadow-sm rounded-md"
                                                    onClick={() => handleAppClick(app)} // Show modal on click
                                                >
                                                    <img src={app.img} alt="app" className="w-10 h-10 mx-auto" />
                                                    {app.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {selectedFunctions[0] ?
                                        <div class="mt-8 flex justify-center items-center" onClick={() => handleFunctionClick(func, selectedApp.side)}>
                                            <div type="button" class="cursor-pointer transition group flex h-14 w-48 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1.5px]  duration-300 hover:bg-gradient-to-l hover:shadow-2xl  shadow-lg">
                                                <div class=" text-lg px-8 py-4  text-center flex h-full w-full items-center justify-center rounded-xl bg-white transition duration-300 ease-in-out group-hover:bg-gradient-to-br  group-hover:transition group-hover:duration-300 group-hover:ease-in-out">
                                                    {selectedFunctions[0]}

                                                </div>
                                            </div>
                                        </div> :
                                        <div> </div>
                                    }

                                    {email && selectedFunctions[0]==="Summarize Mail" && (
                                        <div className="mt-8 flex justify-center items-center flex-col">
                                            <p className="text-lg font-semibold text-blue-500">Email to summarize:</p>
                                            <p className="text-lg font-semibold text-white">{email}</p>
                                        </div>
                                    )}

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
                                    className="w-full min-h-[200px] bg-slate-900 neon-effect p-3 rounded-md mt-3"
                                >
                                    {workspaceRight.map((app, index) => (
                                        <Draggable key={app.id} draggableId={app.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 my-2 bg-white border border-gray-300 text-center cursor-pointer shadow-sm rounded-md"
                                                    onClick={() => handleAppClick(app)} // Show modal on click
                                                >
                                                    <img src={app.img} alt="app" className="w-10 h-10 mx-auto" />
                                                    {app.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {selectedFunctions[1] ?
                                        <div class="mt-8 flex justify-center items-center" onClick={() => handleFunctionClick(func, selectedApp.side)}>
                                            <div type="button" class="cursor-pointer transition group flex h-14 w-48 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1.5px]  duration-300 hover:bg-gradient-to-l hover:shadow-2xl  shadow-lg">
                                                <div class=" text-lg px-8 py-4  text-center flex h-full w-full items-center justify-center rounded-xl bg-white transition duration-300 ease-in-out group-hover:bg-gradient-to-br  group-hover:transition group-hover:duration-300 group-hover:ease-in-out">
                                                    {selectedFunctions[1]}

                                                </div>
                                            </div>
                                        </div> :
                                        <div> </div>
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div class="mt-8">
                        <button type="button" class="transition group flex h-14 w-48 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1.5px] text-white duration-300 hover:bg-gradient-to-l hover:shadow-2xl hover:shadow-blue-600/30 shadow-blue-500/30 shadow-lg" >
                            <div class=" text-2xl px-8 py-4 flex h-full w-full items-center justify-center rounded-xl bg-gray-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 group-hover:transition group-hover:duration-300 group-hover:ease-in-out hover:shadow-blue-600/30" onClick={() => handleRun(selectedFunctions)}>
                                Run
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-1/5 bg-slate-900 p-5">
                    <h3 className="text-lg font-semibold text-white">Available Apps</h3>
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
                                                onClick={() => handleAppClick(app)} // Show modal on click
                                            >
                                                <img src={app.img} alt="app" className="w-10 h-10 mx-auto" />
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

            {isModalOpen && selectedApp && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-md w-80 flex flex-col items-center justify-center">
                        <h2 className="text-xl font-semibold text-center">{selectedApp.name} Functions</h2>
                        <ul className="mt-3 flex flex-col justify-center items-center">
                            {selectedApp && selectedApp.functions.map((func, index) => (
                                <div class="mt-8" onClick={() => handleFunctionClick(func, selectedApp.side)}>
                                    <div type="button" class="cursor-pointer transition group flex h-14 w-48 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1.5px]  duration-300 hover:bg-gradient-to-l hover:shadow-2xl  shadow-lg">
                                        <div class=" text-lg px-8 py-4  text-center flex h-full w-full items-center justify-center rounded-xl bg-white transition duration-300 ease-in-out group-hover:bg-gradient-to-br  group-hover:transition group-hover:duration-300 group-hover:ease-in-out">
                                            <li key={index} className="my-1">{func}</li>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                        <button
                            onClick={closeModal}
                            className="mt-3 px-8 py-2 bg-blue-500 text-white rounded-md flex justify-center items-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {isInputModelOpen && selectedFunctions[0] === "Summarize Mail" && (
                <div className="mt-3 fixed inset-0 bg-gray-500 bg-opacity-60 flex justify-center items-center z-50 flex-col p-4">
                    <label htmlFor="emailInput" className="block text-2xl text-black font-medium bg-white rounded-md px-4 py-2">Enter Email to summarize:</label>
                    <textarea
                        id="emailInput"
                        type="text"
                        rows="6"
                        className="mt-2 p-2 border border-gray-300 rounded-md w-[50%]"
                        placeholder="Enter the email "
                        value={email} // make sure to bind this to the state variable
                        onChange={(e) => setEmail(e.target.value)} // this should update the state with the email input
                    />
                    <div className="flex gap-4">

                        <button
                            onClick={closeModal}
                            className="mt-3 px-8 py-2 bg-blue-500 text-white rounded-md flex justify-center items-center"
                        >
                            Summarize
                        </button>
                        <button
                            onClick={closeModal}
                            className="mt-3 px-8 py-2 bg-blue-500 text-white rounded-md flex justify-center items-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            {selectedFunctions[0] === "Schedule Message" && (
        <div className="mt-3 fixed inset-0 bg-gray-500 bg-opacity-60 flex justify-center items-center z-50 flex-col p-4">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <label className="block text-xl font-medium">Enter Message:</label>
            <textarea
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter the message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <label className="block text-xl font-medium mt-3">Select Date:</label>
            <input
              type="date"
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label className="block text-xl font-medium mt-3">Select Time:</label>
            <input
              type="time"
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={handleScheduleMessage}
                className="px-6 py-2 bg-green-500 text-white rounded-md"
              >
                Schedule
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


        </DragDropContext>
    );
};

export default Dragndrop;
