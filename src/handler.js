/*
{
 id: string,
 title: string,
 createdAt: string,
 updatedAt: string,
 tags: array of string,
 body: string,
},
*/

const { nanoid } = require('nanoid');
const notes = require('./notes')

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        id,
        title,
        createdAt,
        updatedAt,
        tags,
        body,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note)=>note.id === id).length > 0;
    if (isSuccess){
        const response = h.response({
            status: "success",
            message: "Note Succesfully Added",
            data: {
                noteId : id,
            },
        })

        // The Response Code (2xx) makes it not Trigger an Error Popup
        response.code(201);
        return response;
    }else{
        const response = h.response({
            status: "fail",
            message: "Failed to Add Note",
        })

        // The Response Code (500) makes it Trigger an Error Popup
        response.code(500);
        return response;
    }
    

  };

const getAllNotesHandler = (request, h)=>{
    const response = h.response({
        status: "success",
        data: {
            notes,
        }
    })
    
    return response;
}

const getNotesByIdHandler = (request, h)=>{
    const { id } = request.params
    const note = notes.filter((note)=>note.id === id)[0]

    if(note !== undefined){
        const response = h.response({
            status: "success",
            data: {
                note,
            }
        })

        response.code(200);

        return response;
    }else{
        const response = h.response({
            status: "fail",
            message: `Failed to retrieve note with id=${id}`
        })

        response.code(404);

        return response
    }
}

const editNoteByIdHandler = (request, h) => {
    
    const { title, tags, body } = request.payload;
    const { id } = request.params;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note)=>note.id === id);

    if(index !== -1){

        notes[index] = {
            ...notes[index],
            title, tags, body, updatedAt,
        }

        const response = h.response({
            status: 'success',
            message: `Note with id=${id} updated Succesfully!`,
        })

        response.code(200);
        return response;
    }else{
        const response = h.response({
            status: 'fail',
            message: `Note with id=${id} doesn't exist.`,
        })

        response.code(404);
        return response;
    }
    
    
}

const deleteNoteByIdHandler = (request, h)=>{
    const { id } = request.params;
    
    const index = notes.findIndex((note)=>note.id===id);

    if(index!==-1){
        notes.splice(index,1);
        const response = h.response({
            status: "success",
            message: `note with id=${id} Removed Succesfully!`,
        })

        response.code(200);
        return response;
    }else{
        const response = h.response({
            status: "fail",
            message: `note with id=${id} not found.`,
        })

        response.code(404);
        return response;
    }
}

module.exports = { addNoteHandler, getAllNotesHandler, getNotesByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };