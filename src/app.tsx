import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

type Note = {
    id: string,
    date: Date,
    content: string
}

export function App() {
    const [search, setSearch] = useState('')
    const [notes, setNotes] = useState<Note[]>(() => {
        const storedNotes = localStorage.getItem('notes')
        if (storedNotes) {
            return JSON.parse(storedNotes)
        }
        return []
    })

    function onNoteCreated(content: string) {
        const newNote = {
            id: crypto.randomUUID(),
            date: new Date(),
            content
        }

        const notesArray = [newNote, ...notes]
        setNotes(notesArray)

        localStorage.setItem('notes', JSON.stringify(notesArray))
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value)
    }

    function onNoteDeleted(id: string) {
        const notesArray = notes.filter(note => note.id !== id)
        setNotes(notesArray)
        localStorage.setItem('notes', JSON.stringify(notesArray))
    }
    
    const filteredNotes = search !== '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

    return (
        <div className='px-10 xl:px-0 mx-auto max-w-6xl my-12 space-y-6'>
            <img src={logo} alt="NLW Expert" className='w-32' />
            
            <form action="" className='w-full'>
                <input value={search} type="text" placeholder="Busque em suas notas..." className='w-full bg-transparent text-3xl font-semibold tracking-tighter placeholder:text-slate-500 outline-none' onChange={handleSearch} />
            </form>

            <div className="h-px bg-slate-700" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
                
                <NewNoteCard onNoteCreated={onNoteCreated} />

                {filteredNotes.map(note => (
                    <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
                ))}
            </div>
        </div>
    )
}
