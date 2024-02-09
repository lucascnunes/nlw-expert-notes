import { ChangeEvent, FormEvent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { X } from 'lucide-react'

export function NewNoteCard() {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')

    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault()
        if (content === '') {
            toast.error('Por favor, escreva algo antes de salvar.')
        } else {
            toast.success('Nota salva com sucesso!')
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
                <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                <Dialog.Content className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none overflow-hidden'>
                    <Dialog.Title className='p-5 text-xl font-bold text-slate-50'>
                        <span className='text-sm font-medium text-slate-300'>Adicione uma nota</span>
                    </Dialog.Title>
                    <Dialog.Close className='absolute top-5 right-5 bg-slate-700 p-3 rounded-full hover:bg-slate-600'>
                        <X />
                    </Dialog.Close>
                    <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            {
                                shouldShowOnboarding ? (
                                    <p className='text-sm leading-6 text-slate-400'>
                                        Comece <button className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button onClick={() => handleStartEditor()} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                                    </p>
                                ) : (
                                    <textarea onChange={handleContentChange} autoFocus placeholder='Escreva sua nota...' className='w-full h-full bg-transparent placeholder:text-3xl text-base font-semibold tracking-tighter placeholder:text-slate-500 outline-none resize-none' />
                                )
                            }
                        </div>
                        <button type='submit' className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                            Salvar nota
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}