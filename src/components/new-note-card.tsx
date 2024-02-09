import { ChangeEvent, FormEvent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { X } from 'lucide-react'

type NewNoteCardProps = {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

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
            onNoteCreated(content)
            setContent('')
            setShouldShowOnboarding(true)
            toast.success('Nota salva com sucesso!')
        }
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            toast.error('Nenhuma API de reconhecimento de fala disponível.')
            setIsRecording(false)
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        speechRecognition = new SpeechRecognitionAPI()
        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true
        speechRecognition.onresult = (event) => {
            setContent([...content, event.results[0][0].transcript].join(' '))
        }
        speechRecognition.onerror = (event) => {
            toast.error('Erro ao gravar a nota.')
            setIsRecording(false)
            setShouldShowOnboarding(true)
            console.error(event)
            return
        }
        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)
        if (speechRecognition !== null)
            speechRecognition.stop()
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
                <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden'>
                    <Dialog.Title className='p-5 text-xl font-bold text-slate-50'>
                        <span className='text-sm font-medium text-slate-300'>Adicione uma nota</span>
                    </Dialog.Title>
                    <Dialog.Close className='absolute top-5 right-5 bg-slate-700 p-3 rounded-full hover:bg-slate-600'>
                        <X />
                    </Dialog.Close>
                    <form className='flex-1 flex flex-col'>
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            {
                                shouldShowOnboarding ? (
                                    <p className='text-sm leading-6 text-slate-400'>
                                        Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                                    </p>
                                ) : (
                                    <textarea onChange={handleContentChange} autoFocus placeholder='Escreva sua nota...' className='w-full h-full bg-transparent placeholder:text-3xl text-base font-semibold tracking-tighter placeholder:text-slate-500 outline-none resize-none' value={content} />
                                )
                            }
                        </div>
                        
                        {
                            isRecording ? (
                                <button type='button' onClick={handleStopRecording} className='flex items-center justify-center gap-2 w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                                    <div className="size-3 bg-red-400 rounded-full animate-pulse"></div>
                                    Gravando (clique para interromper)
                                </button>
                            ) : (
                                <button type='button' onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                                    Salvar nota
                                </button>
                            )
                        }
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}