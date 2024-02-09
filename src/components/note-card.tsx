import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
type NoteCardProps = {
    note: {
        id: string,
        date: Date,
        content: string
    },
    onNoteDeleted: (content: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className='text-left rounded-md bg-slate-800 p-5 flex flex-col gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-300'>{formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}</span>
                <p className='text-sm leading-6 text-slate-400'>
                    {note.content}
                </p>
                <div className="absolute left-0 bottom-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden'>
                    <Dialog.Title className='p-5 text-xl font-bold text-slate-50'>
                        <span className='text-sm font-medium text-slate-300'>{formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}</span>
                    </Dialog.Title>
                    <Dialog.Close className='absolute top-5 right-5 bg-slate-700 p-3 rounded-full hover:bg-slate-600'>
                        <X />
                    </Dialog.Close>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                        <p className='text-sm leading-6 text-slate-400'>
                            {note.content}
                        </p>
                    </div>
                    <button type='button' onClick={() => onNoteDeleted(note.id)} className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'>
                        Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}